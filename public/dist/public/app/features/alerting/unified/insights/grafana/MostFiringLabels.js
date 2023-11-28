import { getBackendSrv } from '@grafana/runtime';
import { PanelBuilders, RuntimeDataSource, SceneFlexItem, SceneQueryRunner, sceneUtils, } from '@grafana/scenes';
import { getTimeRange } from 'app/features/dashboard/utils/timeRange';
import { PANEL_STYLES } from '../../home/Insights';
export const getLabelsInfo = (from, to) => {
    return getBackendSrv().fetch({
        url: `/api/v1/rules/history`,
        params: { from, to, limit: 100 },
        method: 'GET',
    });
};
class LokiAPIDatasource extends RuntimeDataSource {
    constructor(pluginId, uid, timeRange) {
        super(pluginId, uid);
        this.timeRange = timeRange;
    }
    query(request) {
        const timeRange = getTimeRange({ from: this.timeRange.state.from, to: this.timeRange.state.to });
        return getLabelsInfo(timeRange.from.unix(), timeRange.to.unix());
    }
    testDatasource() {
        return Promise.resolve({ status: 'success', message: 'Data source is working', title: 'Success' });
    }
}
export function getMostFiredLabelsScene(timeRange, datasource, panelTitle) {
    sceneUtils.registerRuntimeDataSource({ dataSource: new LokiAPIDatasource('loki-api-ds', 'LOKI-API', timeRange) });
    const query = new SceneQueryRunner({
        datasource: { uid: 'LOKI-API', type: 'loki-api-ds' },
        queries: [{ refId: 'A', expr: 'vector(1)' }],
        $timeRange: timeRange,
    });
    return new SceneFlexItem(Object.assign(Object.assign({}, PANEL_STYLES), { body: PanelBuilders.table().setTitle(panelTitle).setDescription(panelTitle).setData(query).build() }));
}
//# sourceMappingURL=MostFiringLabels.js.map