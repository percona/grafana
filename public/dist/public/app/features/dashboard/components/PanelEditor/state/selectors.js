import memoizeOne from 'memoize-one';
import { getConfig } from 'app/core/config';
import { contextSrv } from 'app/core/services/context_srv';
import { getRulesPermissions } from 'app/features/alerting/unified/utils/access-control';
import { GRAFANA_RULES_SOURCE_NAME } from 'app/features/alerting/unified/utils/datasource';
import { PanelEditorTabId } from '../types';
export const getPanelEditorTabs = memoizeOne((tab, plugin) => {
    var _a;
    const tabs = [];
    if (!plugin) {
        return tabs;
    }
    let defaultTab = PanelEditorTabId.Visualize;
    if (plugin.meta.skipDataQuery) {
        return [];
    }
    if (!plugin.meta.skipDataQuery) {
        defaultTab = PanelEditorTabId.Query;
        tabs.push({
            id: PanelEditorTabId.Query,
            text: 'Query',
            icon: 'database',
            active: false,
        });
        tabs.push({
            id: PanelEditorTabId.Transform,
            text: 'Transform data',
            icon: 'process',
            active: false,
        });
    }
    const { alertingEnabled, unifiedAlertingEnabled } = getConfig();
    const hasRuleReadPermissions = contextSrv.hasPermission(getRulesPermissions(GRAFANA_RULES_SOURCE_NAME).read);
    const isAlertingAvailable = alertingEnabled || (unifiedAlertingEnabled && hasRuleReadPermissions);
    const isGraph = plugin.meta.id === 'graph';
    const isTimeseries = plugin.meta.id === 'timeseries';
    if ((isAlertingAvailable && isGraph) || isTimeseries) {
        tabs.push({
            id: PanelEditorTabId.Alert,
            text: 'Alert',
            icon: 'bell',
            active: false,
        });
    }
    const activeTab = (_a = tabs.find((item) => item.id === (tab || defaultTab))) !== null && _a !== void 0 ? _a : tabs[0];
    activeTab.active = true;
    return tabs;
});
//# sourceMappingURL=selectors.js.map