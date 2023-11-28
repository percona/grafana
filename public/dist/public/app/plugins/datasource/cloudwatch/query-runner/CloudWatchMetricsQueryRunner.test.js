import { __awaiter } from "tslib";
import { of } from 'rxjs';
import { getFrameDisplayName, VariableHide } from '@grafana/data';
import { dateTime } from '@grafana/data/src/datetime/moment_wrapper';
import { initialVariableModelState } from 'app/features/variables/types';
import * as redux from 'app/store/store';
import { namespaceVariable, metricVariable, labelsVariable, limitVariable, dimensionVariable, periodIntervalVariable, accountIdVariable, } from '../__mocks__/CloudWatchDataSource';
import { setupMockedMetricsQueryRunner } from '../__mocks__/MetricsQueryRunner';
import { validMetricSearchBuilderQuery } from '../__mocks__/queries';
import { MetricQueryType, MetricEditorMode } from '../types';
describe('CloudWatchMetricsQueryRunner', () => {
    describe('performTimeSeriesQuery', () => {
        it('should return the same length of data as result', () => __awaiter(void 0, void 0, void 0, function* () {
            const { runner, timeRange } = setupMockedMetricsQueryRunner({
                data: {
                    results: {
                        a: { refId: 'a', series: [{ target: 'cpu', datapoints: [[1, 1]] }] },
                        b: { refId: 'b', series: [{ target: 'memory', datapoints: [[2, 2]] }] },
                    },
                },
            });
            const observable = runner.performTimeSeriesQuery({
                queries: [
                    { datasourceId: 1, refId: 'a' },
                    { datasourceId: 1, refId: 'b' },
                ],
                from: '',
                to: '',
            }, timeRange);
            yield expect(observable).toEmitValuesWith((received) => {
                const response = received[0];
                expect(response.data.length).toEqual(2);
            });
        }));
        it('sets fields.config.interval based on period', () => __awaiter(void 0, void 0, void 0, function* () {
            const { runner, timeRange } = setupMockedMetricsQueryRunner({
                data: {
                    results: {
                        a: {
                            refId: 'a',
                            series: [{ target: 'cpu', datapoints: [[1, 2]], meta: { custom: { period: 60 } } }],
                        },
                        b: {
                            refId: 'b',
                            series: [{ target: 'cpu', datapoints: [[1, 2]], meta: { custom: { period: 120 } } }],
                        },
                    },
                },
            });
            const observable = runner.performTimeSeriesQuery({
                queries: [{ datasourceId: 1, refId: 'a' }],
                from: '',
                to: '',
            }, timeRange);
            yield expect(observable).toEmitValuesWith((received) => {
                const response = received[0];
                expect(response.data[0].fields[0].config.interval).toEqual(60000);
                expect(response.data[1].fields[0].config.interval).toEqual(120000);
            });
        }));
        describe('When performing CloudWatch metrics query', () => {
            const queries = [
                {
                    id: '',
                    metricQueryType: MetricQueryType.Search,
                    metricEditorMode: MetricEditorMode.Builder,
                    queryMode: 'Metrics',
                    expression: '',
                    refId: 'A',
                    region: 'us-east-1',
                    namespace: 'AWS/EC2',
                    metricName: 'CPUUtilization',
                    dimensions: {
                        InstanceId: 'i-12345678',
                    },
                    statistic: 'Average',
                    period: '300',
                },
            ];
            const data = {
                results: {
                    A: {
                        tables: [],
                        error: '',
                        refId: 'A',
                        series: [
                            {
                                target: 'CPUUtilization_Average',
                                datapoints: [
                                    [1, 1483228800000],
                                    [2, 1483229100000],
                                    [5, 1483229700000],
                                ],
                                tags: {
                                    InstanceId: 'i-12345678',
                                },
                            },
                        ],
                    },
                },
            };
            it('should generate the correct query', () => __awaiter(void 0, void 0, void 0, function* () {
                const { runner, fetchMock, request } = setupMockedMetricsQueryRunner({ data });
                yield expect(runner.handleMetricQueries(queries, request)).toEmitValuesWith(() => {
                    expect(fetchMock.mock.calls[0][0].data.queries).toMatchObject(expect.arrayContaining([
                        expect.objectContaining({
                            namespace: queries[0].namespace,
                            metricName: queries[0].metricName,
                            dimensions: { InstanceId: ['i-12345678'] },
                            statistic: queries[0].statistic,
                            period: queries[0].period,
                        }),
                    ]));
                });
            }));
            it('should generate the correct query with interval variable', () => __awaiter(void 0, void 0, void 0, function* () {
                const queries = [
                    {
                        id: '',
                        metricQueryType: MetricQueryType.Search,
                        metricEditorMode: MetricEditorMode.Builder,
                        queryMode: 'Metrics',
                        refId: 'A',
                        region: 'us-east-1',
                        namespace: 'AWS/EC2',
                        metricName: 'CPUUtilization',
                        dimensions: {
                            InstanceId: 'i-12345678',
                        },
                        statistic: 'Average',
                        period: '[[period]]',
                    },
                ];
                const { runner, fetchMock, request } = setupMockedMetricsQueryRunner({
                    data,
                    variables: [periodIntervalVariable],
                });
                yield expect(runner.handleMetricQueries(queries, request)).toEmitValuesWith(() => {
                    expect(fetchMock.mock.calls[0][0].data.queries[0].period).toEqual('600');
                });
            }));
            it('should return series list', () => __awaiter(void 0, void 0, void 0, function* () {
                const { runner, request } = setupMockedMetricsQueryRunner({ data });
                yield expect(runner.handleMetricQueries(queries, request)).toEmitValuesWith((received) => {
                    var _a, _b;
                    const result = received[0];
                    expect(getFrameDisplayName(result.data[0])).toBe(((_a = data.results.A.series) === null || _a === void 0 ? void 0 : _a.length) && data.results.A.series[0].target);
                    expect(result.data[0].fields[1].values[0]).toBe(((_b = data.results.A.series) === null || _b === void 0 ? void 0 : _b.length) && data.results.A.series[0].datapoints[0][0]);
                });
            }));
            describe('and throttling exception is thrown', () => {
                const partialQuery = {
                    metricQueryType: MetricQueryType.Search,
                    metricEditorMode: MetricEditorMode.Builder,
                    queryMode: 'Metrics',
                    namespace: 'AWS/EC2',
                    metricName: 'CPUUtilization',
                    dimensions: {
                        InstanceId: 'i-12345678',
                    },
                    statistic: 'Average',
                    period: '300',
                    expression: '',
                    id: '',
                    region: '',
                    refId: '',
                };
                const queries = [
                    Object.assign(Object.assign({}, partialQuery), { refId: 'A', region: 'us-east-1' }),
                    Object.assign(Object.assign({}, partialQuery), { refId: 'B', region: 'us-east-2' }),
                    Object.assign(Object.assign({}, partialQuery), { refId: 'C', region: 'us-east-1' }),
                    Object.assign(Object.assign({}, partialQuery), { refId: 'D', region: 'us-east-2' }),
                    Object.assign(Object.assign({}, partialQuery), { refId: 'E', region: 'eu-north-1' }),
                ];
                const backendErrorResponse = {
                    data: {
                        message: 'Throttling: exception',
                        results: {
                            A: {
                                frames: [],
                                series: [],
                                tables: [],
                                error: 'Throttling: exception',
                                refId: 'A',
                                meta: {},
                            },
                            B: {
                                frames: [],
                                series: [],
                                tables: [],
                                error: 'Throttling: exception',
                                refId: 'B',
                                meta: {},
                            },
                            C: {
                                frames: [],
                                series: [],
                                tables: [],
                                error: 'Throttling: exception',
                                refId: 'C',
                                meta: {},
                            },
                            D: {
                                frames: [],
                                series: [],
                                tables: [],
                                error: 'Throttling: exception',
                                refId: 'D',
                                meta: {},
                            },
                            E: {
                                frames: [],
                                series: [],
                                tables: [],
                                error: 'Throttling: exception',
                                refId: 'E',
                                meta: {},
                            },
                        },
                    },
                };
                beforeEach(() => {
                    redux.setStore(Object.assign(Object.assign({}, redux.store), { dispatch: jest.fn() }));
                });
                it('should display one alert error message per region+datasource combination', () => __awaiter(void 0, void 0, void 0, function* () {
                    const { runner, request } = setupMockedMetricsQueryRunner({ data: backendErrorResponse, throws: true });
                    const memoizedDebounceSpy = jest.spyOn(runner, 'debouncedAlert');
                    yield expect(runner.handleMetricQueries(queries, request)).toEmitValuesWith(() => {
                        expect(memoizedDebounceSpy).toHaveBeenCalledWith('CloudWatch Test Datasource', 'us-east-1');
                        expect(memoizedDebounceSpy).toHaveBeenCalledWith('CloudWatch Test Datasource', 'us-east-2');
                        expect(memoizedDebounceSpy).toHaveBeenCalledWith('CloudWatch Test Datasource', 'eu-north-1');
                        expect(memoizedDebounceSpy).toBeCalledTimes(3);
                    });
                }));
            });
        });
    });
    describe('handleMetricQueries ', () => {
        const queries = [
            {
                id: '',
                metricQueryType: MetricQueryType.Search,
                metricEditorMode: MetricEditorMode.Builder,
                queryMode: 'Metrics',
                refId: 'A',
                region: 'us-east-1',
                namespace: 'AWS/ApplicationELB',
                metricName: 'TargetResponseTime',
                dimensions: {
                    LoadBalancer: 'lb',
                    TargetGroup: 'tg',
                },
                statistic: 'p90.00',
                period: '300s',
            },
        ];
        const data = {
            results: {
                A: {
                    tables: [],
                    error: '',
                    refId: 'A',
                    series: [
                        {
                            target: 'TargetResponseTime_p90.00',
                            datapoints: [
                                [1, 1483228800000],
                                [2, 1483229100000],
                                [5, 1483229700000],
                            ],
                            tags: {
                                LoadBalancer: 'lb',
                                TargetGroup: 'tg',
                            },
                        },
                    ],
                },
            },
        };
        it('should return series list', () => __awaiter(void 0, void 0, void 0, function* () {
            const { runner, request } = setupMockedMetricsQueryRunner({ data });
            yield expect(runner.handleMetricQueries(queries, request)).toEmitValuesWith((received) => {
                var _a, _b;
                const result = received[0];
                expect(getFrameDisplayName(result.data[0])).toBe(((_a = data.results.A.series) === null || _a === void 0 ? void 0 : _a.length) && data.results.A.series[0].target);
                expect(result.data[0].fields[1].values[0]).toBe(((_b = data.results.A.series) === null || _b === void 0 ? void 0 : _b.length) && data.results.A.series[0].datapoints[0][0]);
            });
        }));
    });
    describe('template variable interpolation', () => {
        it('replaceMetricQueryVars interpolates account id if its part of the query', () => __awaiter(void 0, void 0, void 0, function* () {
            const { runner } = setupMockedMetricsQueryRunner({
                variables: [accountIdVariable],
            });
            const result = runner.replaceMetricQueryVars(Object.assign(Object.assign({}, validMetricSearchBuilderQuery), { accountId: '$accountId' }), {});
            expect(result.accountId).toBe(accountIdVariable.current.value);
        }));
        it('replaceMetricQueryVars should not change account id if its not part of the query', () => __awaiter(void 0, void 0, void 0, function* () {
            const { runner } = setupMockedMetricsQueryRunner({
                variables: [accountIdVariable],
            });
            const result = runner.replaceMetricQueryVars(Object.assign(Object.assign({}, validMetricSearchBuilderQuery), { accountId: undefined }), {});
            expect(result.accountId).toBeUndefined();
        }));
        it('interpolates variables correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const { runner, fetchMock, request } = setupMockedMetricsQueryRunner({
                variables: [namespaceVariable, metricVariable, labelsVariable, limitVariable],
            });
            runner.handleMetricQueries([
                {
                    id: '',
                    refId: 'a',
                    region: 'us-east-2',
                    namespace: '',
                    period: '',
                    alias: '',
                    metricName: '',
                    dimensions: {},
                    matchExact: true,
                    statistic: '',
                    expression: '',
                    metricQueryType: MetricQueryType.Query,
                    metricEditorMode: MetricEditorMode.Code,
                    sqlExpression: 'SELECT SUM($metric) FROM "$namespace" GROUP BY ${labels:raw} LIMIT $limit',
                },
            ], request);
            expect(fetchMock).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    queries: expect.arrayContaining([
                        expect.objectContaining({
                            sqlExpression: `SELECT SUM(CPUUtilization) FROM "AWS/EC2" GROUP BY InstanceId,InstanceType LIMIT 100`,
                        }),
                    ]),
                }),
            }));
        }));
        describe('When performing CloudWatch query with template variables', () => {
            const key = 'key';
            const var1 = Object.assign(Object.assign({}, initialVariableModelState), { id: 'var1', rootStateKey: key, name: 'var1', index: 0, current: { value: 'var1-foo', text: 'var1-foo', selected: true }, options: [{ value: 'var1-foo', text: 'var1-foo', selected: true }], multi: false, includeAll: false, query: '', hide: VariableHide.dontHide, type: 'custom' });
            const var2 = Object.assign(Object.assign({}, initialVariableModelState), { id: 'var2', rootStateKey: key, name: 'var2', index: 1, current: { value: 'var2-foo', text: 'var2-foo', selected: true }, options: [{ value: 'var2-foo', text: 'var2-foo', selected: true }], multi: false, includeAll: false, query: '', hide: VariableHide.dontHide, type: 'custom' });
            const var3 = Object.assign(Object.assign({}, initialVariableModelState), { id: 'var3', rootStateKey: key, name: 'var3', index: 2, current: { value: ['var3-foo', 'var3-baz'], text: 'var3-foo + var3-baz', selected: true }, options: [
                    { selected: true, value: 'var3-foo', text: 'var3-foo' },
                    { selected: false, value: 'var3-bar', text: 'var3-bar' },
                    { selected: true, value: 'var3-baz', text: 'var3-baz' },
                ], multi: true, includeAll: false, query: '', hide: VariableHide.dontHide, type: 'custom' });
            const var4 = Object.assign(Object.assign({}, initialVariableModelState), { id: 'var4', rootStateKey: key, name: 'var4', index: 3, options: [
                    { selected: true, value: 'var4-foo', text: 'var4-foo' },
                    { selected: false, value: 'var4-bar', text: 'var4-bar' },
                    { selected: true, value: 'var4-baz', text: 'var4-baz' },
                ], current: { value: ['var4-foo', 'var4-baz'], text: 'var4-foo + var4-baz', selected: true }, multi: true, includeAll: false, query: '', hide: VariableHide.dontHide, type: 'custom' });
            it('should generate the correct query for single template variable', () => __awaiter(void 0, void 0, void 0, function* () {
                const { runner, fetchMock, request } = setupMockedMetricsQueryRunner({ variables: [var1, var2, var3, var4] });
                const queries = [
                    {
                        id: '',
                        metricQueryType: MetricQueryType.Search,
                        metricEditorMode: MetricEditorMode.Builder,
                        queryMode: 'Metrics',
                        refId: 'A',
                        region: 'us-east-1',
                        namespace: 'TestNamespace',
                        metricName: 'TestMetricName',
                        dimensions: {
                            dim2: '$var2',
                        },
                        statistic: 'Average',
                        period: '300s',
                    },
                ];
                yield expect(runner.handleMetricQueries(queries, request)).toEmitValuesWith(() => {
                    expect(fetchMock.mock.calls[0][0].data.queries[0].dimensions['dim2']).toStrictEqual(['var2-foo']);
                });
            }));
            it('should generate the correct query in the case of one multiple template variables', () => __awaiter(void 0, void 0, void 0, function* () {
                const { runner, fetchMock, request } = setupMockedMetricsQueryRunner({ variables: [var1, var2, var3, var4] });
                const queries = [
                    {
                        id: '',
                        metricQueryType: MetricQueryType.Search,
                        metricEditorMode: MetricEditorMode.Builder,
                        queryMode: 'Metrics',
                        refId: 'A',
                        region: 'us-east-1',
                        namespace: 'TestNamespace',
                        metricName: 'TestMetricName',
                        dimensions: {
                            dim1: '$var1',
                            dim2: '$var2',
                            dim3: '$var3',
                        },
                        statistic: 'Average',
                        period: '300s',
                    },
                ];
                yield expect(runner.handleMetricQueries(queries, Object.assign(Object.assign({}, request), { scopedVars: {
                        var1: { value: 'var1-foo', text: '' },
                        var2: { value: 'var2-foo', text: '' },
                    } }))).toEmitValuesWith(() => {
                    expect(fetchMock.mock.calls[0][0].data.queries[0].dimensions['dim1']).toStrictEqual(['var1-foo']);
                    expect(fetchMock.mock.calls[0][0].data.queries[0].dimensions['dim2']).toStrictEqual(['var2-foo']);
                    expect(fetchMock.mock.calls[0][0].data.queries[0].dimensions['dim3']).toStrictEqual(['var3-foo', 'var3-baz']);
                });
            }));
            it('should generate the correct query in the case of multiple multi template variables', () => __awaiter(void 0, void 0, void 0, function* () {
                const { runner, fetchMock, request } = setupMockedMetricsQueryRunner({ variables: [var1, var2, var3, var4] });
                const queries = [
                    {
                        id: '',
                        metricQueryType: MetricQueryType.Search,
                        metricEditorMode: MetricEditorMode.Builder,
                        queryMode: 'Metrics',
                        refId: 'A',
                        region: 'us-east-1',
                        namespace: 'TestNamespace',
                        metricName: 'TestMetricName',
                        dimensions: {
                            dim1: '$var1',
                            dim3: '$var3',
                            dim4: '$var4',
                        },
                        statistic: 'Average',
                        period: '300s',
                    },
                ];
                yield expect(runner.handleMetricQueries(queries, request)).toEmitValuesWith(() => {
                    expect(fetchMock.mock.calls[0][0].data.queries[0].dimensions['dim1']).toStrictEqual(['var1-foo']);
                    expect(fetchMock.mock.calls[0][0].data.queries[0].dimensions['dim3']).toStrictEqual(['var3-foo', 'var3-baz']);
                    expect(fetchMock.mock.calls[0][0].data.queries[0].dimensions['dim4']).toStrictEqual(['var4-foo', 'var4-baz']);
                });
            }));
            it('should generate the correct query for multiple template variables, lack scopedVars', () => __awaiter(void 0, void 0, void 0, function* () {
                const { runner, fetchMock, request } = setupMockedMetricsQueryRunner({ variables: [var1, var2, var3, var4] });
                const queries = [
                    {
                        id: '',
                        metricQueryType: MetricQueryType.Search,
                        metricEditorMode: MetricEditorMode.Builder,
                        queryMode: 'Metrics',
                        refId: 'A',
                        region: 'us-east-1',
                        namespace: 'TestNamespace',
                        metricName: 'TestMetricName',
                        dimensions: {
                            dim1: '$var1',
                            dim2: '$var2',
                            dim3: '$var3',
                        },
                        statistic: 'Average',
                        period: '300',
                    },
                ];
                yield expect(runner.handleMetricQueries(queries, Object.assign(Object.assign({}, request), { scopedVars: {
                        var1: { value: 'var1-foo', text: '' },
                    } }))).toEmitValuesWith(() => {
                    expect(fetchMock.mock.calls[0][0].data.queries[0].dimensions['dim1']).toStrictEqual(['var1-foo']);
                    expect(fetchMock.mock.calls[0][0].data.queries[0].dimensions['dim2']).toStrictEqual(['var2-foo']);
                    expect(fetchMock.mock.calls[0][0].data.queries[0].dimensions['dim3']).toStrictEqual(['var3-foo', 'var3-baz']);
                });
            }));
        });
    });
    describe('timezoneUTCOffset', () => {
        beforeEach(() => {
            jest.useFakeTimers().setSystemTime(new Date('2022-09-01'));
        });
        afterEach(() => {
            jest.useFakeTimers().clearAllTimers();
        });
        const testQuery = {
            id: '',
            refId: 'a',
            region: 'us-east-2',
            namespace: '',
            period: '',
            label: '${MAX_TIME_RELATIVE}',
            metricName: '',
            dimensions: {},
            matchExact: true,
            statistic: '',
            expression: '',
            metricQueryType: MetricQueryType.Query,
            metricEditorMode: MetricEditorMode.Code,
            sqlExpression: 'SELECT SUM($metric) FROM "$namespace" GROUP BY ${labels:raw} LIMIT $limit',
        };
        const testTable = [
            ['Europe/Stockholm', '+0200'],
            ['America/New_York', '-0400'],
            ['Asia/Tokyo', '+0900'],
            ['UTC', '+0000'],
        ];
        test.each(testTable)('should use the right time zone offset', (ianaTimezone, expectedOffset) => {
            const { runner, fetchMock, request } = setupMockedMetricsQueryRunner();
            runner.handleMetricQueries([testQuery], Object.assign(Object.assign({}, request), { range: Object.assign(Object.assign({}, request.range), { from: dateTime(), to: dateTime() }), timezone: ianaTimezone }));
            expect(fetchMock).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    queries: expect.arrayContaining([
                        expect.objectContaining({
                            timezoneUTCOffset: expectedOffset,
                        }),
                    ]),
                }),
            }));
        });
    });
    describe('debouncedCustomAlert', () => {
        const debouncedAlert = jest.fn();
        beforeEach(() => {
            const { runner, request } = setupMockedMetricsQueryRunner({
                variables: [
                    Object.assign(Object.assign({}, namespaceVariable), { multi: true }),
                    Object.assign(Object.assign({}, metricVariable), { multi: true }),
                ],
            });
            runner.debouncedCustomAlert = debouncedAlert;
            runner.performTimeSeriesQuery = jest.fn().mockResolvedValue([]);
            runner.handleMetricQueries([
                {
                    queryMode: 'Metrics',
                    id: '',
                    region: 'us-east-2',
                    namespace: namespaceVariable.id,
                    metricName: metricVariable.id,
                    period: '',
                    alias: '',
                    dimensions: {},
                    matchExact: true,
                    statistic: '',
                    refId: '',
                    expression: 'x * 2',
                    metricQueryType: MetricQueryType.Search,
                    metricEditorMode: MetricEditorMode.Code,
                },
            ], request);
        });
        it('should show debounced alert for namespace and metric name', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(debouncedAlert).toHaveBeenCalledWith('CloudWatch templating error', 'Multi template variables are not supported for namespace');
            expect(debouncedAlert).toHaveBeenCalledWith('CloudWatch templating error', 'Multi template variables are not supported for metric name');
        }));
        it('should not show debounced alert for region', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(debouncedAlert).not.toHaveBeenCalledWith('CloudWatch templating error', 'Multi template variables are not supported for region');
        }));
    });
    describe('interpolateMetricsQueryVariables', () => {
        it('interpolates values correctly', () => {
            const testQuery = {
                id: 'a',
                refId: 'a',
                region: 'us-east-2',
                namespace: '',
                expression: 'ABS($datasource)',
                sqlExpression: 'select SUM(CPUUtilization) from $datasource',
                dimensions: { InstanceId: '$dimension' },
            };
            const { runner } = setupMockedMetricsQueryRunner({ variables: [dimensionVariable], mockGetVariableName: false });
            const result = runner.interpolateMetricsQueryVariables(testQuery, {
                datasource: { text: 'foo', value: 'foo' },
                dimension: { text: 'foo', value: 'foo' },
            });
            expect(result).toStrictEqual({
                alias: '',
                metricName: '',
                namespace: '',
                period: '',
                sqlExpression: 'select SUM(CPUUtilization) from foo',
                expression: 'ABS(foo)',
                dimensions: { InstanceId: ['foo'] },
            });
        });
    });
    describe('convertMultiFiltersFormat', () => {
        const { runner } = setupMockedMetricsQueryRunner({
            variables: [labelsVariable, dimensionVariable],
            mockGetVariableName: false,
        });
        it('converts keys and values correctly', () => {
            const filters = { $dimension: ['b'], a: ['$labels', 'bar'] };
            const result = runner.convertMultiFilterFormat(filters);
            expect(result).toStrictEqual({
                env: ['b'],
                a: ['InstanceId', 'InstanceType', 'bar'],
            });
        });
    });
    describe('filterMetricsQuery', () => {
        const runner = setupMockedMetricsQueryRunner().runner;
        let baseQuery;
        beforeEach(() => {
            baseQuery = {
                id: '',
                region: 'us-east-2',
                namespace: '',
                period: '',
                alias: '',
                metricName: '',
                dimensions: {},
                matchExact: true,
                statistic: '',
                expression: '',
                refId: '',
            };
        });
        describe('metric search queries', () => {
            beforeEach(() => {
                baseQuery = Object.assign(Object.assign({}, baseQuery), { namespace: 'AWS/EC2', metricName: 'CPUUtilization', statistic: 'Average', metricQueryType: MetricQueryType.Search, metricEditorMode: MetricEditorMode.Builder });
            });
            it('should not allow builder queries that dont have namespace, metric or statistic', () => __awaiter(void 0, void 0, void 0, function* () {
                expect(runner.filterMetricQuery(Object.assign(Object.assign({}, baseQuery), { statistic: undefined }))).toBeFalsy();
                expect(runner.filterMetricQuery(Object.assign(Object.assign({}, baseQuery), { metricName: undefined }))).toBeFalsy();
                expect(runner.filterMetricQuery(Object.assign(Object.assign({}, baseQuery), { namespace: '' }))).toBeFalsy();
            }));
            it('should allow builder queries that have namespace, metric or statistic', () => __awaiter(void 0, void 0, void 0, function* () {
                expect(runner.filterMetricQuery(baseQuery)).toBeTruthy();
            }));
            it('should not allow code queries that dont have an expression', () => __awaiter(void 0, void 0, void 0, function* () {
                expect(runner.filterMetricQuery(Object.assign(Object.assign({}, baseQuery), { expression: undefined, metricEditorMode: MetricEditorMode.Code }))).toBeFalsy();
            }));
            it('should allow code queries that have an expression', () => __awaiter(void 0, void 0, void 0, function* () {
                expect(runner.filterMetricQuery(Object.assign(Object.assign({}, baseQuery), { expression: 'x * 2', metricEditorMode: MetricEditorMode.Code }))).toBeTruthy();
            }));
        });
        describe('metric search expression queries', () => {
            beforeEach(() => {
                baseQuery = Object.assign(Object.assign({}, baseQuery), { metricQueryType: MetricQueryType.Search, metricEditorMode: MetricEditorMode.Code });
            });
            it('should not allow queries that dont have an expression', () => __awaiter(void 0, void 0, void 0, function* () {
                const valid = runner.filterMetricQuery(baseQuery);
                expect(valid).toBeFalsy();
            }));
            it('should allow queries that have an expression', () => __awaiter(void 0, void 0, void 0, function* () {
                baseQuery.expression = 'SUM([a,x])';
                const valid = runner.filterMetricQuery(baseQuery);
                expect(valid).toBeTruthy();
            }));
        });
        describe('metric query queries', () => {
            beforeEach(() => {
                baseQuery = Object.assign(Object.assign({}, baseQuery), { metricQueryType: MetricQueryType.Query, metricEditorMode: MetricEditorMode.Code });
            });
            it('should not allow queries that dont have a sql expresssion', () => __awaiter(void 0, void 0, void 0, function* () {
                const valid = runner.filterMetricQuery(baseQuery);
                expect(valid).toBeFalsy();
            }));
            it('should allow queries that have a sql expresssion', () => __awaiter(void 0, void 0, void 0, function* () {
                baseQuery.sqlExpression = 'select SUM(CPUUtilization) from "AWS/EC2"';
                const valid = runner.filterMetricQuery(baseQuery);
                expect(valid).toBeTruthy();
            }));
        });
    });
    describe('When query region is "default"', () => {
        it('should return the datasource region if empty or "default"', () => {
            const { runner, instanceSettings } = setupMockedMetricsQueryRunner();
            const defaultRegion = instanceSettings.jsonData.defaultRegion;
            expect(runner.getActualRegion()).toBe(defaultRegion);
            expect(runner.getActualRegion('')).toBe(defaultRegion);
            expect(runner.getActualRegion('default')).toBe(defaultRegion);
        });
        it('should return the specified region if specified', () => {
            const { runner } = setupMockedMetricsQueryRunner();
            expect(runner.getActualRegion('some-fake-region-1')).toBe('some-fake-region-1');
        });
        it('should query for the datasource region if empty or "default"', () => __awaiter(void 0, void 0, void 0, function* () {
            const { runner, instanceSettings, request } = setupMockedMetricsQueryRunner();
            const performTimeSeriesQueryMock = jest
                .spyOn(runner, 'performTimeSeriesQuery')
                .mockReturnValue(of({ data: [], error: undefined }));
            const queries = [
                {
                    id: '',
                    metricQueryType: MetricQueryType.Search,
                    metricEditorMode: MetricEditorMode.Builder,
                    queryMode: 'Metrics',
                    refId: 'A',
                    region: 'default',
                    namespace: 'AWS/EC2',
                    metricName: 'CPUUtilization',
                    dimensions: {
                        InstanceId: 'i-12345678',
                    },
                    statistic: 'Average',
                    period: '300s',
                },
            ];
            yield expect(runner.handleMetricQueries(queries, request)).toEmitValuesWith(() => {
                expect(performTimeSeriesQueryMock.mock.calls[0][0].queries[0].region).toBe(instanceSettings.jsonData.defaultRegion);
            });
        }));
    });
});
//# sourceMappingURL=CloudWatchMetricsQueryRunner.test.js.map