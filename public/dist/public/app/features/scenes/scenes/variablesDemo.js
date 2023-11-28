import { SceneCanvasText, SceneTimePicker, SceneFlexLayout, SceneTimeRange, VariableValueSelectors, SceneVariableSet, CustomVariable, DataSourceVariable, TestVariable, NestedScene, SceneRefreshPicker, TextBoxVariable, SceneFlexItem, PanelBuilders, } from '@grafana/scenes';
import { DashboardScene } from '../../dashboard-scene/scene/DashboardScene';
import { getQueryRunnerWithRandomWalkQuery } from './queries';
export function getVariablesDemo() {
    return new DashboardScene({
        title: 'Variables',
        $variables: new SceneVariableSet({
            variables: [
                new TestVariable({
                    name: 'server',
                    query: 'A.*',
                    value: 'server',
                    text: '',
                    delayMs: 1000,
                    options: [],
                }),
                new TestVariable({
                    name: 'pod',
                    query: 'A.$server.*',
                    value: 'pod',
                    delayMs: 1000,
                    isMulti: true,
                    text: '',
                    options: [],
                }),
                new TestVariable({
                    name: 'handler',
                    query: 'A.$server.$pod.*',
                    value: 'handler',
                    delayMs: 1000,
                    //isMulti: true,
                    text: '',
                    options: [],
                }),
                new CustomVariable({
                    name: 'custom',
                    query: 'A : 10,B : 20',
                }),
                new DataSourceVariable({
                    name: 'ds',
                    pluginId: 'testdata',
                }),
                new TextBoxVariable({
                    name: 'textbox',
                    value: 'default value',
                }),
            ],
        }),
        body: new SceneFlexLayout({
            direction: 'row',
            children: [
                new SceneFlexItem({
                    body: new SceneFlexLayout({
                        direction: 'column',
                        children: [
                            new SceneFlexItem({
                                body: new SceneFlexLayout({
                                    children: [
                                        new SceneFlexItem({
                                            body: PanelBuilders.timeseries()
                                                .setTitle('handler: $handler')
                                                .setData(getQueryRunnerWithRandomWalkQuery({
                                                alias: 'handler: $handler',
                                            }))
                                                .build(),
                                        }),
                                        new SceneFlexItem({
                                            body: new SceneCanvasText({
                                                text: 'Text: ${textbox}',
                                                fontSize: 20,
                                                align: 'center',
                                            }),
                                        }),
                                        new SceneFlexItem({
                                            width: '40%',
                                            body: new SceneCanvasText({
                                                text: 'server: ${server} pod:${pod}',
                                                fontSize: 20,
                                                align: 'center',
                                            }),
                                        }),
                                    ],
                                }),
                            }),
                            new SceneFlexItem({
                                body: new NestedScene({
                                    title: 'Collapsable inner scene',
                                    canCollapse: true,
                                    body: new SceneFlexLayout({
                                        direction: 'row',
                                        children: [
                                            new SceneFlexItem({
                                                body: PanelBuilders.timeseries()
                                                    .setTitle('handler: $handler')
                                                    .setData(getQueryRunnerWithRandomWalkQuery({
                                                    alias: 'handler: $handler',
                                                }))
                                                    .build(),
                                            }),
                                        ],
                                    }),
                                }),
                            }),
                        ],
                    }),
                }),
            ],
        }),
        $timeRange: new SceneTimeRange(),
        actions: [new SceneTimePicker({}), new SceneRefreshPicker({})],
        controls: [new VariableValueSelectors({})],
    });
}
export function getVariablesDemoWithAll() {
    return new DashboardScene({
        title: 'Variables with All values',
        $variables: new SceneVariableSet({
            variables: [
                new TestVariable({
                    name: 'server',
                    query: 'A.*',
                    value: 'AA',
                    text: 'AA',
                    includeAll: true,
                    defaultToAll: true,
                    delayMs: 1000,
                    options: [],
                }),
                new TestVariable({
                    name: 'pod',
                    query: 'A.$server.*',
                    value: [],
                    delayMs: 1000,
                    isMulti: true,
                    includeAll: true,
                    defaultToAll: true,
                    text: '',
                    options: [],
                }),
                new TestVariable({
                    name: 'handler',
                    query: 'A.$server.$pod.*',
                    value: [],
                    delayMs: 1000,
                    includeAll: true,
                    defaultToAll: false,
                    isMulti: true,
                    text: '',
                    options: [],
                }),
            ],
        }),
        body: new SceneFlexLayout({
            direction: 'row',
            children: [
                new SceneFlexItem({
                    body: PanelBuilders.timeseries()
                        .setTitle('handler: $handler')
                        .setData(getQueryRunnerWithRandomWalkQuery({
                        alias: 'handler: $handler',
                    }))
                        .build(),
                }),
                new SceneFlexItem({
                    width: '40%',
                    body: new SceneCanvasText({
                        text: 'server: ${server} pod:${pod}',
                        fontSize: 20,
                        align: 'center',
                    }),
                }),
            ],
        }),
        $timeRange: new SceneTimeRange(),
        actions: [new SceneTimePicker({}), new SceneRefreshPicker({})],
        controls: [new VariableValueSelectors({})],
    });
}
//# sourceMappingURL=variablesDemo.js.map