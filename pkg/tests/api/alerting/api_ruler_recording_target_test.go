package alerting

import (
	"encoding/json"
	"net/http"
	"testing"
	"time"

	prommodel "github.com/prometheus/common/model"
	"github.com/stretchr/testify/require"

	"github.com/grafana/grafana/pkg/services/datasources"
	apimodels "github.com/grafana/grafana/pkg/services/ngalert/api/tooling/definitions"
	"github.com/grafana/grafana/pkg/services/org"
	"github.com/grafana/grafana/pkg/services/user"
	"github.com/grafana/grafana/pkg/tests/testinfra"
	"github.com/grafana/grafana/pkg/util"
	"github.com/grafana/grafana/pkg/util/testutil"
)

// Writing a recording rule's result needs write access to its target data source, not only query access (PMM-15941).
func TestIntegrationRulerRecordingRuleTargetNeedsWriteAccess(t *testing.T) {
	testutil.SkipIntegrationTestInShortMode(t)
	testinfra.SQLiteIntegrationTest(t)

	dir, gpath := testinfra.CreateGrafDir(t, testinfra.GrafanaOpts{
		DisableLegacyAlerting: true,
		EnableUnifiedAlerting: true,
		DisableAnonymous:      true,
		AppModeProduction:     true,
		EnableRecordingRules:  true,
	})
	grafanaListedAddr, env := testinfra.StartGrafanaEnv(t, dir, gpath)

	adminClient := newAlertingApiClient(grafanaListedAddr, "admin", "admin")
	createUser(t, env.SQLStore, env.Cfg, user.CreateUserCommand{
		DefaultOrgRole: string(org.RoleEditor),
		Password:       "password",
		Login:          "editor",
	})
	editorClient := newAlertingApiClient(grafanaListedAddr, "editor", "password")

	sourceDS := adminClient.CreateDatasource(t, datasources.DS_PROMETHEUS)
	targetDS := adminClient.CreateDatasource(t, datasources.DS_PROMETHEUS)

	folderUID := util.GenerateShortUID()
	adminClient.CreateFolder(t, folderUID, "recording-target")

	group := func(metric, target string) *apimodels.PostableRuleGroupConfig {
		return &apimodels.PostableRuleGroupConfig{
			Name:     "recording",
			Interval: prommodel.Duration(time.Minute),
			Rules: []apimodels.PostableExtendedRuleNode{{
				ApiRuleNode: &apimodels.ApiRuleNode{},
				GrafanaManagedAlert: &apimodels.PostableGrafanaRule{
					Title: "recording rule",
					Data: []apimodels.AlertQuery{{
						RefID:         "A",
						DatasourceUID: sourceDS.Body.Datasource.UID,
						Model:         json.RawMessage(`{"expr": "up", "refId": "A"}`),
						RelativeTimeRange: apimodels.RelativeTimeRange{
							From: apimodels.Duration(5 * time.Minute),
						},
					}},
					Record: &apimodels.Record{
						Metric:              metric,
						From:                "A",
						TargetDatasourceUID: target,
					},
				},
			}},
		}
	}

	t.Run("an editor cannot create a recording rule", func(t *testing.T) {
		_, status, body := editorClient.PostRulesGroupWithStatus(t, folderUID, group("recorded", targetDS.Body.Datasource.UID), false)
		require.Equalf(t, http.StatusForbidden, status, body)
		require.Contains(t, body, "target data source")
	})

	t.Run("an editor can still create an alert rule", func(t *testing.T) {
		alert := group("", "")
		alert.Name = "alerting"
		alert.Rules[0].ApiRuleNode.For = new(prommodel.Duration)
		alert.Rules[0].GrafanaManagedAlert.Record = nil
		alert.Rules[0].GrafanaManagedAlert.Condition = "A"
		alert.Rules[0].GrafanaManagedAlert.NoDataState = apimodels.NoData
		alert.Rules[0].GrafanaManagedAlert.ExecErrState = apimodels.AlertingErrState
		_, status, body := editorClient.PostRulesGroupWithStatus(t, folderUID, alert, false)
		require.Equalf(t, http.StatusAccepted, status, body)
	})

	t.Run("an admin can create a recording rule", func(t *testing.T) {
		_, status, body := adminClient.PostRulesGroupWithStatus(t, folderUID, group("recorded", targetDS.Body.Datasource.UID), false)
		require.Equalf(t, http.StatusAccepted, status, body)
	})

	t.Run("an editor cannot change the admin's recording rule", func(t *testing.T) {
		rules, status, raw := editorClient.GetRulesGroupWithStatus(t, folderUID, "recording")
		require.Equalf(t, http.StatusAccepted, status, string(raw))

		changed := group("up", targetDS.Body.Datasource.UID)
		changed.Rules[0].GrafanaManagedAlert.UID = rules.Rules[0].GrafanaManagedAlert.UID
		_, status, body := editorClient.PostRulesGroupWithStatus(t, folderUID, changed, false)
		require.Equalf(t, http.StatusForbidden, status, body)
	})
}
