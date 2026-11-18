package alerting

import (
	"encoding/json"
	"net/http"
	"testing"
	"time"

	prommodel "github.com/prometheus/common/model"
	"github.com/stretchr/testify/require"

	"github.com/grafana/grafana/pkg/server"
	"github.com/grafana/grafana/pkg/services/accesscontrol"
	"github.com/grafana/grafana/pkg/services/accesscontrol/resourcepermissions"
	"github.com/grafana/grafana/pkg/services/datasources"
	"github.com/grafana/grafana/pkg/services/featuremgmt"
	apimodels "github.com/grafana/grafana/pkg/services/ngalert/api/tooling/definitions"
	"github.com/grafana/grafana/pkg/services/org"
	"github.com/grafana/grafana/pkg/services/user"
	"github.com/grafana/grafana/pkg/tests/testinfra"
	"github.com/grafana/grafana/pkg/util"
	"github.com/grafana/grafana/pkg/util/testutil"
)

// grantDatasourceWrite lets an Editor create recording rules, which by default only Admins can (PMM-15941).
func grantDatasourceWrite(t *testing.T, env *server.TestEnv, userID int64) {
	t.Helper()
	store := resourcepermissions.NewStore(env.Cfg, env.SQLStore, featuremgmt.WithFeatures())
	_, err := store.SetUserResourcePermission(t.Context(), 1, accesscontrol.User{ID: userID}, resourcepermissions.SetResourcePermissionCommand{
		Actions:           []string{datasources.ActionWrite},
		Resource:          datasources.ScopeRoot,
		ResourceID:        "*",
		ResourceAttribute: "uid",
	}, nil)
	require.NoError(t, err)
}

// Writing a recording rule's result needs write access to its target data source, not only query access (PMM-15941).
func TestIntegrationRulerRecordingRuleTargetNeedsWriteAccess(t *testing.T) {
	testutil.SkipIntegrationTestInShortMode(t)
	testinfra.SQLiteIntegrationTest(t)

	dir, gpath := testinfra.CreateGrafDir(t, testinfra.GrafanaOpts{
		// Each subtest creates its own folder, which a cached Editor permission set would not include yet.
		DisableAuthZClientCache: true,
		DisableLegacyAlerting:   true,
		EnableUnifiedAlerting:   true,
		DisableAnonymous:        true,
		AppModeProduction:       true,
		EnableRecordingRules:    true,
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

	newFolder := func(t *testing.T) string {
		uid := util.GenerateShortUID()
		adminClient.CreateFolder(t, uid, uid)
		return uid
	}
	recordingRule := func(title, metric string) apimodels.PostableExtendedRuleNode {
		return apimodels.PostableExtendedRuleNode{
			ApiRuleNode: &apimodels.ApiRuleNode{},
			GrafanaManagedAlert: &apimodels.PostableGrafanaRule{
				Title: title,
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
					TargetDatasourceUID: targetDS.Body.Datasource.UID,
				},
			},
		}
	}
	alertRule := func(title string) apimodels.PostableExtendedRuleNode {
		rule := recordingRule(title, "")
		rule.ApiRuleNode.For = new(prommodel.Duration)
		rule.GrafanaManagedAlert.Record = nil
		rule.GrafanaManagedAlert.Condition = "A"
		rule.GrafanaManagedAlert.NoDataState = apimodels.NoData
		rule.GrafanaManagedAlert.ExecErrState = apimodels.AlertingErrState
		return rule
	}
	groupOf := func(rules ...apimodels.PostableExtendedRuleNode) *apimodels.PostableRuleGroupConfig {
		return &apimodels.PostableRuleGroupConfig{Name: "group", Interval: prommodel.Duration(time.Minute), Rules: rules}
	}
	// adminCreates saves the group as an Admin and returns it as stored, which is what clients post back.
	adminCreates := func(t *testing.T, folderUID string, group *apimodels.PostableRuleGroupConfig) apimodels.RuleGroupConfigResponse {
		_, status, body := adminClient.PostRulesGroupWithStatus(t, folderUID, group, false)
		require.Equalf(t, http.StatusAccepted, status, body)
		stored, status, raw := editorClient.GetRulesGroupWithStatus(t, folderUID, group.Name)
		require.Equalf(t, http.StatusAccepted, status, string(raw))
		require.Len(t, stored.Rules, len(group.Rules))
		return stored
	}
	// postedBack turns a stored rule into the rule a client sends when it leaves it unchanged.
	postedBack := func(rule apimodels.PostableExtendedRuleNode, stored apimodels.GettableExtendedRuleNode) apimodels.PostableExtendedRuleNode {
		rule.GrafanaManagedAlert.UID = stored.GrafanaManagedAlert.UID
		rule.GrafanaManagedAlert.Data = stored.GrafanaManagedAlert.Data
		return rule
	}

	t.Run("an editor cannot create a recording rule", func(t *testing.T) {
		_, status, body := editorClient.PostRulesGroupWithStatus(t, newFolder(t), groupOf(recordingRule("recording rule", "recorded")), false)
		require.Equalf(t, http.StatusForbidden, status, body)
		require.Contains(t, body, "target data source")
	})

	t.Run("an editor can still create an alert rule", func(t *testing.T) {
		_, status, body := editorClient.PostRulesGroupWithStatus(t, newFolder(t), groupOf(alertRule("alert rule")), false)
		require.Equalf(t, http.StatusAccepted, status, body)
	})

	t.Run("an admin can create a recording rule", func(t *testing.T) {
		_, status, body := adminClient.PostRulesGroupWithStatus(t, newFolder(t), groupOf(recordingRule("recording rule", "recorded")), false)
		require.Equalf(t, http.StatusAccepted, status, body)
	})

	t.Run("an editor cannot change the admin's recording rule", func(t *testing.T) {
		folderUID := newFolder(t)
		stored := adminCreates(t, folderUID, groupOf(recordingRule("recording rule", "recorded")))

		changed := groupOf(postedBack(recordingRule("recording rule", "up"), stored.Rules[0]))
		_, status, body := editorClient.PostRulesGroupWithStatus(t, folderUID, changed, false)
		require.Equalf(t, http.StatusForbidden, status, body)
		require.Contains(t, body, "target data source")
	})

	t.Run("an editor can delete an alert rule ordered before the admin's recording rule", func(t *testing.T) {
		folderUID := newFolder(t)
		recording := recordingRule("recording rule", "recorded")
		stored := adminCreates(t, folderUID, groupOf(alertRule("alert rule"), recording))

		_, status, body := editorClient.PostRulesGroupWithStatus(t, folderUID, groupOf(postedBack(recording, stored.Rules[1])), false)
		require.Equalf(t, http.StatusAccepted, status, body)

		after, status, raw := editorClient.GetRulesGroupWithStatus(t, folderUID, "group")
		require.Equalf(t, http.StatusAccepted, status, string(raw))
		require.Len(t, after.Rules, 1)
		require.Equal(t, stored.Rules[1].GrafanaManagedAlert.UID, after.Rules[0].GrafanaManagedAlert.UID)
	})

	t.Run("an editor can pause but not resume a folder with the admin's recording rule", func(t *testing.T) {
		folderUID := newFolder(t)
		adminCreates(t, folderUID, groupOf(alertRule("alert rule"), recordingRule("recording rule", "recorded")))
		setPaused := func(client apiClient, paused bool) (int, string) {
			_, status, body := client.UpdateNamespaceRules(t, folderUID, &apimodels.UpdateNamespaceRulesRequest{IsPaused: &paused})
			return status, body
		}

		status, body := setPaused(editorClient, true)
		require.Equalf(t, http.StatusAccepted, status, body)
		stored, status, raw := editorClient.GetRulesGroupWithStatus(t, folderUID, "group")
		require.Equalf(t, http.StatusAccepted, status, string(raw))
		for _, rule := range stored.Rules {
			require.Truef(t, rule.GrafanaManagedAlert.IsPaused, "rule '%s' is not paused", rule.GrafanaManagedAlert.Title)
		}

		status, body = setPaused(editorClient, false)
		require.Equalf(t, http.StatusForbidden, status, body)
		require.Contains(t, body, "target data source")

		status, body = setPaused(adminClient, false)
		require.Equalf(t, http.StatusAccepted, status, body)
	})
}
