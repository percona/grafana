package provisioning

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/services/ngalert/models"
	"github.com/grafana/grafana/pkg/services/ngalert/store"
	"github.com/grafana/grafana/pkg/services/quota"
	"github.com/grafana/grafana/pkg/util"
)

type AlertRuleService struct {
	defaultIntervalSeconds int64
	baseIntervalSeconds    int64
	ruleStore              RuleStore
	provenanceStore        ProvisioningStore
	quotas                 QuotaChecker
	xact                   TransactionManager
	log                    log.Logger
}

func NewAlertRuleService(ruleStore RuleStore,
	provenanceStore ProvisioningStore,
	quotas QuotaChecker,
	xact TransactionManager,
	defaultIntervalSeconds int64,
	baseIntervalSeconds int64,
	log log.Logger) *AlertRuleService {
	return &AlertRuleService{
		defaultIntervalSeconds: defaultIntervalSeconds,
		baseIntervalSeconds:    baseIntervalSeconds,
		ruleStore:              ruleStore,
		provenanceStore:        provenanceStore,
		quotas:                 quotas,
		xact:                   xact,
		log:                    log,
	}
}

func (service *AlertRuleService) GetAlertRule(ctx context.Context, orgID int64, ruleUID string) (models.AlertRule, models.Provenance, error) {
	query := &models.GetAlertRuleByUIDQuery{
		OrgID: orgID,
		UID:   ruleUID,
	}
	err := service.ruleStore.GetAlertRuleByUID(ctx, query)
	if err != nil {
		return models.AlertRule{}, models.ProvenanceNone, err
	}
	provenance, err := service.provenanceStore.GetProvenance(ctx, query.Result, orgID)
	if err != nil {
		return models.AlertRule{}, models.ProvenanceNone, err
	}
	return *query.Result, provenance, nil
}

// CreateAlertRule creates a new alert rule. This function will ignore any
// interval that is set in the rule struct and use the already existing group
// interval or the default one.
func (service *AlertRuleService) CreateAlertRule(ctx context.Context, rule models.AlertRule, provenance models.Provenance, userID int64) (models.AlertRule, error) {
	if rule.UID == "" {
		rule.UID = util.GenerateShortUID()
	}
	interval, err := service.ruleStore.GetRuleGroupInterval(ctx, rule.OrgID, rule.NamespaceUID, rule.RuleGroup)
	// if the alert group does not exists we just use the default interval
	if err != nil && errors.Is(err, store.ErrAlertRuleGroupNotFound) {
		interval = service.defaultIntervalSeconds
	} else if err != nil {
		return models.AlertRule{}, err
	}
	rule.IntervalSeconds = interval
	err = rule.SetDashboardAndPanelFromAnnotations()
	if err != nil {
		return models.AlertRule{}, err
	}
	rule.Updated = time.Now()
	err = service.xact.InTransaction(ctx, func(ctx context.Context) error {
		ids, err := service.ruleStore.InsertAlertRules(ctx, []models.AlertRule{
			rule,
		})
		if err != nil {
			return err
		}
		if id, ok := ids[rule.UID]; ok {
			rule.ID = id
		} else {
			return errors.New("couldn't find newly created id")
		}

		if err = service.checkLimitsTransactionCtx(ctx, rule.OrgID, userID); err != nil {
			return err
		}

		return service.provenanceStore.SetProvenance(ctx, &rule, rule.OrgID, provenance)
	})
	if err != nil {
		return models.AlertRule{}, err
	}
	return rule, nil
}

func (service *AlertRuleService) GetRuleGroup(ctx context.Context, orgID int64, folder, group string) (models.AlertRuleGroup, error) {
	q := models.ListAlertRulesQuery{
		OrgID:         orgID,
		NamespaceUIDs: []string{folder},
		RuleGroup:     group,
	}
	if err := service.ruleStore.ListAlertRules(ctx, &q); err != nil {
		return models.AlertRuleGroup{}, err
	}
	if len(q.Result) == 0 {
		return models.AlertRuleGroup{}, store.ErrAlertRuleGroupNotFound
	}
	res := models.AlertRuleGroup{
		Title:     q.Result[0].RuleGroup,
		FolderUID: q.Result[0].NamespaceUID,
		Interval:  q.Result[0].IntervalSeconds,
		Rules:     []models.AlertRule{},
	}
	for _, r := range q.Result {
		if r != nil {
			res.Rules = append(res.Rules, *r)
		}
	}
	return res, nil
}

// UpdateRuleGroup will update the interval for all rules in the group.
func (service *AlertRuleService) UpdateRuleGroup(ctx context.Context, orgID int64, namespaceUID string, ruleGroup string, intervalSeconds int64) error {
	if err := models.ValidateRuleGroupInterval(intervalSeconds, service.baseIntervalSeconds); err != nil {
		return err
	}
	return service.xact.InTransaction(ctx, func(ctx context.Context) error {
		query := &models.ListAlertRulesQuery{
			OrgID:         orgID,
			NamespaceUIDs: []string{namespaceUID},
			RuleGroup:     ruleGroup,
		}
		err := service.ruleStore.ListAlertRules(ctx, query)
		if err != nil {
			return fmt.Errorf("failed to list alert rules: %w", err)
		}
		updateRules := make([]store.UpdateRule, 0, len(query.Result))
		for _, rule := range query.Result {
			if rule.IntervalSeconds == intervalSeconds {
				continue
			}
			newRule := *rule
			newRule.IntervalSeconds = intervalSeconds
			updateRules = append(updateRules, store.UpdateRule{
				Existing: rule,
				New:      newRule,
			})
		}
		return service.ruleStore.UpdateAlertRules(ctx, updateRules)
	})
}

func (service *AlertRuleService) ReplaceRuleGroup(ctx context.Context, orgID int64, group models.AlertRuleGroup, userID int64, provenance models.Provenance) error {
	if err := models.ValidateRuleGroupInterval(group.Interval, service.baseIntervalSeconds); err != nil {
		return err
	}

	// If the provided request did not provide the rules list at all, treat it as though it does not wish to change rules.
	// This is done for backwards compatibility. Requests which specify only the interval must update only the interval.
	if group.Rules == nil {
		listRulesQuery := models.ListAlertRulesQuery{
			OrgID:         orgID,
			NamespaceUIDs: []string{group.FolderUID},
			RuleGroup:     group.Title,
		}
		if err := service.ruleStore.ListAlertRules(ctx, &listRulesQuery); err != nil {
			return fmt.Errorf("failed to list alert rules: %w", err)
		}
		group.Rules = make([]models.AlertRule, 0, len(listRulesQuery.Result))
		for _, r := range listRulesQuery.Result {
			if r != nil {
				group.Rules = append(group.Rules, *r)
			}
		}
	}

	key := models.AlertRuleGroupKey{
		OrgID:        orgID,
		NamespaceUID: group.FolderUID,
		RuleGroup:    group.Title,
	}
	rules := make([]*models.AlertRule, len(group.Rules))
	group = *syncGroupRuleFields(&group, orgID)
	for i := range group.Rules {
		if err := group.Rules[i].SetDashboardAndPanelFromAnnotations(); err != nil {
			return err
		}
		rules = append(rules, &group.Rules[i])
	}
	delta, err := store.CalculateChanges(ctx, service.ruleStore, key, rules)
	if err != nil {
		return fmt.Errorf("failed to calculate diff for alert rules: %w", err)
	}

	// Refresh all calculated fields across all rules.
	delta = store.UpdateCalculatedRuleFields(delta)

	if len(delta.New) == 0 && len(delta.Update) == 0 && len(delta.Delete) == 0 {
		return nil
	}

	return service.xact.InTransaction(ctx, func(ctx context.Context) error {
		uids, err := service.ruleStore.InsertAlertRules(ctx, withoutNilAlertRules(delta.New))
		if err != nil {
			return fmt.Errorf("failed to insert alert rules: %w", err)
		}
		for uid := range uids {
			if err := service.provenanceStore.SetProvenance(ctx, &models.AlertRule{UID: uid}, orgID, provenance); err != nil {
				return err
			}
		}

		updates := make([]store.UpdateRule, 0, len(delta.Update))
		for _, update := range delta.Update {
			// check that provenance is not changed in a invalid way
			storedProvenance, err := service.provenanceStore.GetProvenance(ctx, update.New, orgID)
			if err != nil {
				return err
			}
			if storedProvenance != provenance && storedProvenance != models.ProvenanceNone {
				return fmt.Errorf("cannot update with provided provenance '%s', needs '%s'", provenance, storedProvenance)
			}
			updates = append(updates, store.UpdateRule{
				Existing: update.Existing,
				New:      *update.New,
			})
		}
		if err = service.ruleStore.UpdateAlertRules(ctx, updates); err != nil {
			return fmt.Errorf("failed to update alert rules: %w", err)
		}
		for _, update := range delta.Update {
			if err := service.provenanceStore.SetProvenance(ctx, update.New, orgID, provenance); err != nil {
				return err
			}
		}

		for _, delete := range delta.Delete {
			// check that provenance is not changed in a invalid way
			storedProvenance, err := service.provenanceStore.GetProvenance(ctx, delete, orgID)
			if err != nil {
				return err
			}
			if storedProvenance != provenance && storedProvenance != models.ProvenanceNone {
				return fmt.Errorf("cannot update with provided provenance '%s', needs '%s'", provenance, storedProvenance)
			}
		}
		if err := service.deleteRules(ctx, orgID, delta.Delete...); err != nil {
			return err
		}

		if err = service.checkLimitsTransactionCtx(ctx, orgID, userID); err != nil {
			return err
		}

		return nil
	})
}

// CreateAlertRule creates a new alert rule. This function will ignore any
// interval that is set in the rule struct and fetch the current group interval
// from database.
func (service *AlertRuleService) UpdateAlertRule(ctx context.Context, rule models.AlertRule, provenance models.Provenance) (models.AlertRule, error) {
	storedRule, storedProvenance, err := service.GetAlertRule(ctx, rule.OrgID, rule.UID)
	if err != nil {
		return models.AlertRule{}, err
	}
	if storedProvenance != provenance && storedProvenance != models.ProvenanceNone {
		return models.AlertRule{}, fmt.Errorf("cannot changed provenance from '%s' to '%s'", storedProvenance, provenance)
	}
	rule.Updated = time.Now()
	rule.ID = storedRule.ID
	rule.IntervalSeconds = storedRule.IntervalSeconds
	err = rule.SetDashboardAndPanelFromAnnotations()
	if err != nil {
		return models.AlertRule{}, err
	}
	err = service.xact.InTransaction(ctx, func(ctx context.Context) error {
		err := service.ruleStore.UpdateAlertRules(ctx, []store.UpdateRule{
			{
				Existing: &storedRule,
				New:      rule,
			},
		})
		if err != nil {
			return err
		}
		return service.provenanceStore.SetProvenance(ctx, &rule, rule.OrgID, provenance)
	})
	if err != nil {
		return models.AlertRule{}, err
	}
	return rule, err
}

func (service *AlertRuleService) DeleteAlertRule(ctx context.Context, orgID int64, ruleUID string, provenance models.Provenance) error {
	rule := &models.AlertRule{
		OrgID: orgID,
		UID:   ruleUID,
	}
	// check that provenance is not changed in a invalid way
	storedProvenance, err := service.provenanceStore.GetProvenance(ctx, rule, rule.OrgID)
	if err != nil {
		return err
	}
	if storedProvenance != provenance && storedProvenance != models.ProvenanceNone {
		return fmt.Errorf("cannot delete with provided provenance '%s', needs '%s'", provenance, storedProvenance)
	}
	return service.xact.InTransaction(ctx, func(ctx context.Context) error {
		return service.deleteRules(ctx, orgID, rule)
	})
}

// checkLimitsTransactionCtx checks whether the current transaction (as identified by the ctx) breaches configured alert rule limits.
func (service *AlertRuleService) checkLimitsTransactionCtx(ctx context.Context, orgID, userID int64) error {
	limitReached, err := service.quotas.CheckQuotaReached(ctx, "alert_rule", &quota.ScopeParameters{
		OrgID:  orgID,
		UserID: userID,
	})
	if err != nil {
		return fmt.Errorf("failed to check alert rule quota: %w", err)
	}
	if limitReached {
		return models.ErrQuotaReached
	}
	return nil
}

// deleteRules deletes a set of target rules and associated data, while checking for database consistency.
func (service *AlertRuleService) deleteRules(ctx context.Context, orgID int64, targets ...*models.AlertRule) error {
	uids := make([]string, 0, len(targets))
	for _, tgt := range targets {
		if tgt != nil {
			uids = append(uids, tgt.UID)
		}
	}
	if err := service.ruleStore.DeleteAlertRulesByUID(ctx, orgID, uids...); err != nil {
		return err
	}
	for _, uid := range uids {
		if err := service.provenanceStore.DeleteProvenance(ctx, &models.AlertRule{UID: uid}, orgID); err != nil {
			// We failed to clean up the record, but this doesn't break things. Log it and move on.
			service.log.Warn("failed to delete provenance record for rule: %w", err)
		}
	}
	return nil
}

// syncRuleGroupFields synchronizes calculated fields across multiple rules in a group.
func syncGroupRuleFields(group *models.AlertRuleGroup, orgID int64) *models.AlertRuleGroup {
	for i := range group.Rules {
		group.Rules[i].IntervalSeconds = group.Interval
		group.Rules[i].RuleGroup = group.Title
		group.Rules[i].NamespaceUID = group.FolderUID
		group.Rules[i].OrgID = orgID
	}
	return group
}

func withoutNilAlertRules(ptrs []*models.AlertRule) []models.AlertRule {
	result := make([]models.AlertRule, 0, len(ptrs))
	for _, ptr := range ptrs {
		if ptr != nil {
			result = append(result, *ptr)
		}
	}
	return result
}
