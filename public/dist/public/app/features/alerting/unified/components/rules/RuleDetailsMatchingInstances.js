import { css, cx } from '@emotion/css';
import { countBy, sum } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, useStyles2 } from '@grafana/ui';
import { MatcherFilter } from 'app/features/alerting/unified/components/alert-groups/MatcherFilter';
import { AlertInstanceStateFilter, } from 'app/features/alerting/unified/components/rules/AlertInstanceStateFilter';
import { labelsMatchMatchers, parseMatchers } from 'app/features/alerting/unified/utils/alertmanager';
import { createViewLink, sortAlerts } from 'app/features/alerting/unified/utils/misc';
import { SortOrder } from 'app/plugins/panel/alertlist/types';
import { mapStateWithReasonToBaseState } from 'app/types/unified-alerting-dto';
import { GRAFANA_RULES_SOURCE_NAME, isGrafanaRulesSource } from '../../utils/datasource';
import { isAlertingRule } from '../../utils/rules';
import { DetailsField } from '../DetailsField';
import { AlertInstancesTable } from './AlertInstancesTable';
import { getComponentsFromStats } from './RuleStats';
function ShowMoreInstances(props) {
    const styles = useStyles2(getStyles);
    const { onClick, stats } = props;
    return (React.createElement("div", { className: styles.footerRow },
        React.createElement("div", null,
            "Showing ",
            stats.visibleItemsCount,
            " out of ",
            stats.totalItemsCount,
            " instances"),
        React.createElement(Button, { size: "sm", variant: "secondary", "data-testid": "show-all", onClick: onClick },
            "Show all ",
            stats.totalItemsCount,
            " alert instances")));
}
export function RuleDetailsMatchingInstances(props) {
    const history = useHistory();
    const { rule: { promRule, namespace, instanceTotals }, itemsDisplayLimit = Number.POSITIVE_INFINITY, pagination, enableFiltering = false, } = props;
    const [queryString, setQueryString] = useState();
    const [alertState, setAlertState] = useState();
    // This key is used to force a rerender on the inputs when the filters are cleared
    const [filterKey] = useState(Math.floor(Math.random() * 100));
    const queryStringKey = `queryString-${filterKey}`;
    const styles = useStyles2(getStyles);
    const stateFilterType = isGrafanaRulesSource(namespace.rulesSource) ? GRAFANA_RULES_SOURCE_NAME : 'prometheus';
    const alerts = useMemo(() => {
        var _a;
        return isAlertingRule(promRule) && ((_a = promRule.alerts) === null || _a === void 0 ? void 0 : _a.length)
            ? filterAlerts(queryString, alertState, sortAlerts(SortOrder.Importance, promRule.alerts))
            : [];
    }, [promRule, alertState, queryString]);
    if (!isAlertingRule(promRule)) {
        return null;
    }
    const visibleInstances = alerts.slice(0, itemsDisplayLimit);
    // Count All By State is used only when filtering is enabled and we have access to all instances
    const countAllByState = countBy(promRule.alerts, (alert) => mapStateWithReasonToBaseState(alert.state));
    const totalInstancesCount = sum(Object.values(instanceTotals));
    const hiddenInstancesCount = totalInstancesCount - visibleInstances.length;
    const stats = {
        totalItemsCount: totalInstancesCount,
        visibleItemsCount: visibleInstances.length,
    };
    const ruleViewPageLink = createViewLink(namespace.rulesSource, props.rule, location.pathname + location.search);
    const statsComponents = getComponentsFromStats(instanceTotals);
    const resetFilter = () => setAlertState(undefined);
    const navigateToDetailView = () => history.push(ruleViewPageLink);
    const onShowMoreInstances = enableFiltering ? resetFilter : navigateToDetailView;
    const footerRow = hiddenInstancesCount ? (React.createElement(ShowMoreInstances, { stats: stats, onClick: onShowMoreInstances })) : undefined;
    return (React.createElement(DetailsField, { label: "Matching instances", horizontal: true },
        enableFiltering && (React.createElement("div", { className: cx(styles.flexRow, styles.spaceBetween) },
            React.createElement("div", { className: styles.flexRow },
                React.createElement(MatcherFilter, { className: styles.rowChild, key: queryStringKey, defaultQueryString: queryString, onFilterChange: (value) => setQueryString(value) }),
                React.createElement(AlertInstanceStateFilter, { className: styles.rowChild, filterType: stateFilterType, stateFilter: alertState, onStateFilterChange: setAlertState, itemPerStateStats: countAllByState })))),
        !enableFiltering && React.createElement("div", { className: styles.stats }, statsComponents),
        React.createElement(AlertInstancesTable, { instances: visibleInstances, pagination: pagination, footerRow: footerRow })));
}
function filterAlerts(alertInstanceLabel, alertInstanceState, alerts) {
    let filteredAlerts = [...alerts];
    if (alertInstanceLabel) {
        const matchers = parseMatchers(alertInstanceLabel || '');
        filteredAlerts = filteredAlerts.filter(({ labels }) => labelsMatchMatchers(labels, matchers));
    }
    if (alertInstanceState) {
        filteredAlerts = filteredAlerts.filter((alert) => {
            return mapStateWithReasonToBaseState(alert.state) === alertInstanceState;
        });
    }
    return filteredAlerts;
}
const getStyles = (theme) => {
    return {
        flexRow: css `
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      width: 100%;
      flex-wrap: wrap;
      margin-bottom: ${theme.spacing(1)};
    `,
        spaceBetween: css `
      justify-content: space-between;
    `,
        rowChild: css `
      margin-right: ${theme.spacing(1)};
    `,
        footerRow: css `
      display: flex;
      flex-direction: column;
      gap: ${theme.spacing(1)};
      justify-content: space-between;
      align-items: center;
      width: 100%;
    `,
        instancesContainer: css `
      margin-bottom: ${theme.spacing(2)};
    `,
        stats: css `
      display: flex;
      gap: ${theme.spacing(1)};
      padding: ${theme.spacing(1, 0)};
    `,
    };
};
//# sourceMappingURL=RuleDetailsMatchingInstances.js.map