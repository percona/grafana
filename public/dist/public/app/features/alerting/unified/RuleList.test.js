import { __awaiter } from "tslib";
import { prettyDOM, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TestProvider } from 'test/helpers/TestProvider';
import { byRole, byTestId, byText } from 'testing-library-selector';
import { locationService, logInfo, setBackendSrv, setDataSourceSrv } from '@grafana/runtime';
import { backendSrv } from 'app/core/services/backend_srv';
import * as ruleActionButtons from 'app/features/alerting/unified/components/rules/RuleActionsButtons';
import * as actions from 'app/features/alerting/unified/state/actions';
import { AccessControlAction } from 'app/types';
import { PromAlertingRuleState, PromApplication } from 'app/types/unified-alerting-dto';
import { LogMessages } from './Analytics';
import RuleList from './RuleList';
import { discoverFeatures } from './api/buildInfo';
import { fetchRules } from './api/prometheus';
import { deleteNamespace, deleteRulerRulesGroup, fetchRulerRules, setRulerRuleGroup } from './api/ruler';
import { grantUserPermissions, mockDataSource, MockDataSourceSrv, mockPromAlert, mockPromAlertingRule, mockPromRecordingRule, mockPromRuleGroup, mockPromRuleNamespace, somePromRules, someRulerRules, } from './mocks';
import * as config from './utils/config';
import { DataSourceType, GRAFANA_RULES_SOURCE_NAME } from './utils/datasource';
jest.mock('./api/buildInfo');
jest.mock('./api/prometheus');
jest.mock('./api/ruler');
jest.mock('../../../core/hooks/useMediaQueryChange');
jest.spyOn(ruleActionButtons, 'matchesWidth').mockReturnValue(false);
jest.mock('app/core/core', () => (Object.assign(Object.assign({}, jest.requireActual('app/core/core')), { appEvents: {
        subscribe: () => {
            return { unsubscribe: () => { } };
        },
        emit: () => { },
    } })));
jest.mock('@grafana/runtime', () => {
    const original = jest.requireActual('@grafana/runtime');
    return Object.assign(Object.assign({}, original), { logInfo: jest.fn() });
});
jest.spyOn(config, 'getAllDataSources');
jest.spyOn(actions, 'rulesInSameGroupHaveInvalidFor').mockReturnValue([]);
const mocks = {
    getAllDataSourcesMock: jest.mocked(config.getAllDataSources),
    rulesInSameGroupHaveInvalidForMock: jest.mocked(actions.rulesInSameGroupHaveInvalidFor),
    api: {
        discoverFeatures: jest.mocked(discoverFeatures),
        fetchRules: jest.mocked(fetchRules),
        fetchRulerRules: jest.mocked(fetchRulerRules),
        deleteGroup: jest.mocked(deleteRulerRulesGroup),
        deleteNamespace: jest.mocked(deleteNamespace),
        setRulerRuleGroup: jest.mocked(setRulerRuleGroup),
    },
};
const renderRuleList = () => {
    locationService.push('/');
    return render(React.createElement(TestProvider, null,
        React.createElement(RuleList, null)));
};
const dataSources = {
    prom: mockDataSource({
        name: 'Prometheus',
        type: DataSourceType.Prometheus,
    }),
    promdisabled: mockDataSource({
        name: 'Prometheus-disabled',
        type: DataSourceType.Prometheus,
        jsonData: {
            manageAlerts: false,
        },
    }),
    loki: mockDataSource({
        name: 'Loki',
        type: DataSourceType.Loki,
    }),
    promBroken: mockDataSource({
        name: 'Prometheus-broken',
        type: DataSourceType.Prometheus,
    }),
};
const ui = {
    ruleGroup: byTestId('rule-group'),
    cloudRulesSourceErrors: byTestId('cloud-rulessource-errors'),
    groupCollapseToggle: byTestId('group-collapse-toggle'),
    ruleCollapseToggle: byTestId('collapse-toggle'),
    rulesTable: byTestId('rules-table'),
    ruleRow: byTestId('row'),
    expandedContent: byTestId('expanded-content'),
    rulesFilterInput: byTestId('search-query-input'),
    moreErrorsButton: byRole('button', { name: /more errors/ }),
    editCloudGroupIcon: byTestId('edit-group'),
    newRuleButton: byRole('link', { name: 'New alert rule' }),
    moreButton: byRole('button', { name: 'More' }),
    exportButton: byRole('menuitem', {
        name: /export all grafana\-managed rules/i,
    }),
    editGroupModal: {
        dialog: byRole('dialog'),
        namespaceInput: byRole('textbox', { name: /^Namespace/ }),
        ruleGroupInput: byRole('textbox', { name: /Evaluation group/ }),
        intervalInput: byRole('textbox', {
            name: /Evaluation interval How often is the rule evaluated. Applies to every rule within the group./i,
        }),
        saveButton: byRole('button', { name: /Save/ }),
    },
};
beforeAll(() => {
    setBackendSrv(backendSrv);
});
describe('RuleList', () => {
    beforeEach(() => {
        grantUserPermissions([
            AccessControlAction.AlertingRuleRead,
            AccessControlAction.AlertingRuleUpdate,
            AccessControlAction.AlertingRuleExternalRead,
            AccessControlAction.AlertingRuleExternalWrite,
        ]);
        mocks.rulesInSameGroupHaveInvalidForMock.mockReturnValue([]);
    });
    afterEach(() => {
        jest.resetAllMocks();
        setDataSourceSrv(undefined);
    });
    it('load & show rule groups from multiple cloud data sources', () => __awaiter(void 0, void 0, void 0, function* () {
        mocks.getAllDataSourcesMock.mockReturnValue(Object.values(dataSources));
        setDataSourceSrv(new MockDataSourceSrv(dataSources));
        mocks.api.discoverFeatures.mockResolvedValue({
            application: PromApplication.Prometheus,
            features: {
                rulerApiEnabled: true,
            },
        });
        mocks.api.fetchRules.mockImplementation((dataSourceName) => {
            if (dataSourceName === dataSources.prom.name) {
                return Promise.resolve([
                    mockPromRuleNamespace({
                        name: 'default',
                        dataSourceName: dataSources.prom.name,
                        groups: [
                            mockPromRuleGroup({
                                name: 'group-2',
                            }),
                            mockPromRuleGroup({
                                name: 'group-1',
                            }),
                        ],
                    }),
                ]);
            }
            else if (dataSourceName === dataSources.loki.name) {
                return Promise.resolve([
                    mockPromRuleNamespace({
                        name: 'default',
                        dataSourceName: dataSources.loki.name,
                        groups: [
                            mockPromRuleGroup({
                                name: 'group-1',
                            }),
                        ],
                    }),
                    mockPromRuleNamespace({
                        name: 'lokins',
                        dataSourceName: dataSources.loki.name,
                        groups: [
                            mockPromRuleGroup({
                                name: 'group-1',
                            }),
                        ],
                    }),
                ]);
            }
            else if (dataSourceName === dataSources.promBroken.name) {
                return Promise.reject({ message: 'this datasource is broken' });
            }
            else if (dataSourceName === GRAFANA_RULES_SOURCE_NAME) {
                return Promise.resolve([
                    mockPromRuleNamespace({
                        name: 'foofolder',
                        dataSourceName: GRAFANA_RULES_SOURCE_NAME,
                        groups: [
                            mockPromRuleGroup({
                                name: 'grafana-group',
                                rules: [
                                    mockPromAlertingRule({
                                        query: '[]',
                                    }),
                                ],
                            }),
                        ],
                    }),
                ]);
            }
            return Promise.reject(new Error(`unexpected datasourceName: ${dataSourceName}`));
        });
        mocks.api.fetchRulerRules.mockRejectedValue({ status: 500, data: { message: 'Server error' } });
        yield renderRuleList();
        yield waitFor(() => expect(mocks.api.fetchRules).toHaveBeenCalledTimes(4));
        const groups = yield ui.ruleGroup.findAll();
        expect(groups).toHaveLength(5);
        expect(groups[0]).toHaveTextContent('foofolder');
        expect(groups[1]).toHaveTextContent('default group-1');
        expect(groups[2]).toHaveTextContent('default group-1');
        expect(groups[3]).toHaveTextContent('default group-2');
        expect(groups[4]).toHaveTextContent('lokins group-1');
        const errors = yield ui.cloudRulesSourceErrors.find();
        expect(errors).not.toHaveTextContent('Failed to load rules state from Prometheus-broken: this datasource is broken');
        yield userEvent.click(ui.moreErrorsButton.get());
        expect(errors).toHaveTextContent('Failed to load rules state from Prometheus-broken: this datasource is broken');
    }));
    it('expand rule group, rule and alert details', () => __awaiter(void 0, void 0, void 0, function* () {
        mocks.getAllDataSourcesMock.mockReturnValue([dataSources.prom]);
        setDataSourceSrv(new MockDataSourceSrv({ prom: dataSources.prom }));
        mocks.api.discoverFeatures.mockResolvedValue({
            application: PromApplication.Cortex,
            features: {
                rulerApiEnabled: true,
            },
        });
        mocks.api.fetchRules.mockImplementation((dataSourceName) => {
            if (dataSourceName === GRAFANA_RULES_SOURCE_NAME) {
                return Promise.resolve([]);
            }
            else {
                return Promise.resolve([
                    mockPromRuleNamespace({
                        groups: [
                            mockPromRuleGroup({
                                name: 'group-1',
                            }),
                            mockPromRuleGroup({
                                name: 'group-2',
                                rules: [
                                    mockPromRecordingRule({
                                        name: 'recordingrule',
                                    }),
                                    mockPromAlertingRule({
                                        name: 'alertingrule',
                                        labels: {
                                            severity: 'warning',
                                            foo: 'bar',
                                        },
                                        query: 'topk(5, foo)[5m]',
                                        annotations: {
                                            message: 'great alert',
                                        },
                                        alerts: [
                                            mockPromAlert({
                                                labels: {
                                                    foo: 'bar',
                                                    severity: 'warning',
                                                },
                                                value: '2e+10',
                                                annotations: {
                                                    message: 'first alert message',
                                                },
                                            }),
                                            mockPromAlert({
                                                labels: {
                                                    foo: 'baz',
                                                    severity: 'error',
                                                },
                                                value: '3e+11',
                                                annotations: {
                                                    message: 'first alert message',
                                                },
                                            }),
                                        ],
                                    }),
                                    mockPromAlertingRule({
                                        name: 'p-rule',
                                        alerts: [],
                                        state: PromAlertingRuleState.Pending,
                                    }),
                                    mockPromAlertingRule({
                                        name: 'i-rule',
                                        alerts: [],
                                        state: PromAlertingRuleState.Inactive,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ]);
            }
        });
        yield renderRuleList();
        const groups = yield ui.ruleGroup.findAll();
        expect(groups).toHaveLength(2);
        yield waitFor(() => expect(groups[0]).toHaveTextContent(/firing|pending|normal/));
        yield waitFor(() => expect(groups[1]).toHaveTextContent(/firing|pending|normal/));
        expect(groups[0]).toHaveTextContent('1 firing');
        expect(groups[1]).toHaveTextContent('1 firing');
        expect(groups[1]).toHaveTextContent('1 pending');
        expect(groups[1]).toHaveTextContent('1 recording');
        expect(groups[1]).toHaveTextContent('1 normal');
        // expand second group to see rules table
        expect(ui.rulesTable.query()).not.toBeInTheDocument();
        yield userEvent.click(ui.groupCollapseToggle.get(groups[1]));
        const table = yield ui.rulesTable.find(groups[1]);
        // check that rule rows are rendered properly
        let ruleRows = ui.ruleRow.getAll(table);
        expect(ruleRows).toHaveLength(4);
        expect(ruleRows[0]).toHaveTextContent('Recording rule');
        expect(ruleRows[0]).toHaveTextContent('recordingrule');
        expect(ruleRows[1]).toHaveTextContent('Firing');
        expect(ruleRows[1]).toHaveTextContent('alertingrule');
        expect(ruleRows[2]).toHaveTextContent('Pending');
        expect(ruleRows[2]).toHaveTextContent('p-rule');
        expect(ruleRows[3]).toHaveTextContent('Normal');
        expect(ruleRows[3]).toHaveTextContent('i-rule');
        expect(byText('Labels').query()).not.toBeInTheDocument();
        // expand alert details
        yield userEvent.click(ui.ruleCollapseToggle.get(ruleRows[1]));
        const ruleDetails = ui.expandedContent.get(ruleRows[1]);
        expect(ruleDetails).toHaveTextContent('Labels severitywarning foobar');
        expect(ruleDetails).toHaveTextContent('Expressiontopk ( 5 , foo ) [ 5m ]');
        expect(ruleDetails).toHaveTextContent('messagegreat alert');
        expect(ruleDetails).toHaveTextContent('Matching instances');
        // finally, check instances table
        const instancesTable = byTestId('dynamic-table').get(ruleDetails);
        expect(instancesTable).toBeInTheDocument();
        const instanceRows = byTestId('row').getAll(instancesTable);
        expect(instanceRows).toHaveLength(2);
        expect(instanceRows[0]).toHaveTextContent('Firing foobar severitywarning2021-03-18 08:47:05');
        expect(instanceRows[1]).toHaveTextContent('Firing foobaz severityerror2021-03-18 08:47:05');
        // expand details of an instance
        yield userEvent.click(ui.ruleCollapseToggle.get(instanceRows[0]));
        const alertDetails = byTestId('expanded-content').get(instanceRows[0]);
        expect(alertDetails).toHaveTextContent('Value2e+10');
        expect(alertDetails).toHaveTextContent('messagefirst alert message');
        // collapse everything again
        yield userEvent.click(ui.ruleCollapseToggle.get(instanceRows[0]));
        expect(byTestId('expanded-content').query(instanceRows[0])).not.toBeInTheDocument();
        yield userEvent.click(ui.ruleCollapseToggle.getAll(ruleRows[1])[0]);
        yield userEvent.click(ui.groupCollapseToggle.get(groups[1]));
        expect(ui.rulesTable.query()).not.toBeInTheDocument();
    }));
    it('filters rules and alerts by labels', () => __awaiter(void 0, void 0, void 0, function* () {
        mocks.getAllDataSourcesMock.mockReturnValue([dataSources.prom]);
        setDataSourceSrv(new MockDataSourceSrv({ prom: dataSources.prom }));
        mocks.api.discoverFeatures.mockResolvedValue({
            application: PromApplication.Cortex,
            features: {
                rulerApiEnabled: true,
            },
        });
        mocks.api.fetchRulerRules.mockResolvedValue({});
        mocks.api.fetchRules.mockImplementation((dataSourceName) => {
            if (dataSourceName === GRAFANA_RULES_SOURCE_NAME) {
                return Promise.resolve([]);
            }
            else {
                return Promise.resolve([
                    mockPromRuleNamespace({
                        groups: [
                            mockPromRuleGroup({
                                name: 'group-1',
                                rules: [
                                    mockPromAlertingRule({
                                        name: 'alertingrule',
                                        labels: {
                                            severity: 'warning',
                                            foo: 'bar',
                                        },
                                        query: 'topk(5, foo)[5m]',
                                        annotations: {
                                            message: 'great alert',
                                        },
                                        alerts: [
                                            mockPromAlert({
                                                labels: {
                                                    foo: 'bar',
                                                    severity: 'warning',
                                                },
                                                value: '2e+10',
                                                annotations: {
                                                    message: 'first alert message',
                                                },
                                            }),
                                            mockPromAlert({
                                                labels: {
                                                    foo: 'baz',
                                                    severity: 'error',
                                                },
                                                value: '3e+11',
                                                annotations: {
                                                    message: 'first alert message',
                                                },
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            mockPromRuleGroup({
                                name: 'group-2',
                                rules: [
                                    mockPromAlertingRule({
                                        name: 'alertingrule2',
                                        labels: {
                                            severity: 'error',
                                            foo: 'buzz',
                                        },
                                        query: 'topk(5, foo)[5m]',
                                        annotations: {
                                            message: 'great alert',
                                        },
                                        alerts: [
                                            mockPromAlert({
                                                labels: {
                                                    foo: 'buzz',
                                                    severity: 'error',
                                                    region: 'EU',
                                                },
                                                value: '2e+10',
                                                annotations: {
                                                    message: 'alert message',
                                                },
                                            }),
                                            mockPromAlert({
                                                labels: {
                                                    foo: 'buzz',
                                                    severity: 'error',
                                                    region: 'US',
                                                },
                                                value: '3e+11',
                                                annotations: {
                                                    message: 'alert message',
                                                },
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ]);
            }
        });
        yield renderRuleList();
        const groups = yield ui.ruleGroup.findAll();
        expect(groups).toHaveLength(2);
        const filterInput = ui.rulesFilterInput.get();
        yield userEvent.type(filterInput, 'label:foo=bar{Enter}');
        // Input is debounced so wait for it to be visible
        yield waitFor(() => expect(filterInput).toHaveValue('label:foo=bar'));
        // Group doesn't contain matching labels
        yield waitFor(() => expect(ui.ruleGroup.queryAll()).toHaveLength(1));
        yield userEvent.click(ui.groupCollapseToggle.get(groups[0]));
        const ruleRows = ui.ruleRow.getAll(groups[0]);
        expect(ruleRows).toHaveLength(1);
        yield userEvent.click(ui.ruleCollapseToggle.get(ruleRows[0]));
        const ruleDetails = ui.expandedContent.get(ruleRows[0]);
        expect(ruleDetails).toHaveTextContent('Labels severitywarning foobar');
        // Check for different label matchers
        yield userEvent.clear(filterInput);
        yield userEvent.type(filterInput, 'label:foo!=bar label:foo!=baz{Enter}');
        // Group doesn't contain matching labels
        yield waitFor(() => expect(ui.ruleGroup.queryAll()).toHaveLength(1));
        yield waitFor(() => expect(ui.ruleGroup.get()).toHaveTextContent('group-2'));
        yield userEvent.clear(filterInput);
        yield userEvent.type(filterInput, 'label:"foo=~b.+"{Enter}');
        yield waitFor(() => expect(ui.ruleGroup.queryAll()).toHaveLength(2));
        yield userEvent.clear(filterInput);
        yield userEvent.type(filterInput, 'label:region=US{Enter}');
        yield waitFor(() => expect(ui.ruleGroup.queryAll()).toHaveLength(1));
        yield waitFor(() => expect(ui.ruleGroup.get()).toHaveTextContent('group-2'));
    }));
    describe('edit lotex groups, namespaces', () => {
        const testDatasources = {
            prom: dataSources.prom,
        };
        function testCase(name, fn) {
            it(name, () => __awaiter(this, void 0, void 0, function* () {
                mocks.getAllDataSourcesMock.mockReturnValue(Object.values(testDatasources));
                setDataSourceSrv(new MockDataSourceSrv(testDatasources));
                mocks.api.discoverFeatures.mockResolvedValue({
                    application: PromApplication.Cortex,
                    features: {
                        rulerApiEnabled: true,
                    },
                });
                mocks.api.fetchRules.mockImplementation((sourceName) => Promise.resolve(sourceName === testDatasources.prom.name ? somePromRules() : []));
                mocks.api.fetchRulerRules.mockImplementation(({ dataSourceName }) => Promise.resolve(dataSourceName === testDatasources.prom.name ? someRulerRules : {}));
                mocks.api.setRulerRuleGroup.mockResolvedValue();
                mocks.api.deleteNamespace.mockResolvedValue();
                yield renderRuleList();
                expect(yield ui.rulesFilterInput.find()).toHaveValue('');
                yield waitFor(() => expect(ui.ruleGroup.queryAll()).toHaveLength(3));
                const groups = yield ui.ruleGroup.findAll();
                expect(groups).toHaveLength(3);
                // open edit dialog
                yield userEvent.click(ui.editCloudGroupIcon.get(groups[0]));
                yield waitFor(() => expect(ui.editGroupModal.dialog.get()).toBeInTheDocument());
                prettyDOM(ui.editGroupModal.dialog.get());
                expect(ui.editGroupModal.namespaceInput.get()).toHaveDisplayValue('namespace1');
                expect(ui.editGroupModal.ruleGroupInput.get()).toHaveDisplayValue('group1');
                yield fn();
            }));
        }
        testCase('rename both lotex namespace and group', () => __awaiter(void 0, void 0, void 0, function* () {
            // make changes to form
            yield userEvent.clear(ui.editGroupModal.namespaceInput.get());
            yield userEvent.type(ui.editGroupModal.namespaceInput.get(), 'super namespace');
            yield userEvent.clear(ui.editGroupModal.ruleGroupInput.get());
            yield userEvent.type(ui.editGroupModal.ruleGroupInput.get(), 'super group');
            yield userEvent.type(ui.editGroupModal.intervalInput.get(), '5m');
            // submit, check that appropriate calls were made
            yield userEvent.click(ui.editGroupModal.saveButton.get());
            yield waitFor(() => expect(ui.editGroupModal.namespaceInput.query()).not.toBeInTheDocument());
            expect(mocks.api.setRulerRuleGroup).toHaveBeenCalledTimes(2);
            expect(mocks.api.deleteNamespace).toHaveBeenCalledTimes(1);
            expect(mocks.api.deleteGroup).not.toHaveBeenCalled();
            expect(mocks.api.fetchRulerRules).toHaveBeenCalledTimes(4);
            expect(mocks.api.setRulerRuleGroup).toHaveBeenNthCalledWith(1, { dataSourceName: testDatasources.prom.name, apiVersion: 'legacy' }, 'super namespace', Object.assign(Object.assign({}, someRulerRules['namespace1'][0]), { name: 'super group', interval: '5m' }));
            expect(mocks.api.setRulerRuleGroup).toHaveBeenNthCalledWith(2, { dataSourceName: testDatasources.prom.name, apiVersion: 'legacy' }, 'super namespace', someRulerRules['namespace1'][1]);
            expect(mocks.api.deleteNamespace).toHaveBeenLastCalledWith({ dataSourceName: testDatasources.prom.name, apiVersion: 'legacy' }, 'namespace1');
        }));
        testCase('rename just the lotex group', () => __awaiter(void 0, void 0, void 0, function* () {
            // make changes to form
            yield userEvent.clear(ui.editGroupModal.ruleGroupInput.get());
            yield userEvent.type(ui.editGroupModal.ruleGroupInput.get(), 'super group');
            yield userEvent.type(ui.editGroupModal.intervalInput.get(), '5m');
            // submit, check that appropriate calls were made
            yield userEvent.click(ui.editGroupModal.saveButton.get());
            yield waitFor(() => expect(ui.editGroupModal.namespaceInput.query()).not.toBeInTheDocument());
            expect(mocks.api.setRulerRuleGroup).toHaveBeenCalledTimes(1);
            expect(mocks.api.deleteGroup).toHaveBeenCalledTimes(1);
            expect(mocks.api.deleteNamespace).not.toHaveBeenCalled();
            expect(mocks.api.fetchRulerRules).toHaveBeenCalledTimes(4);
            expect(mocks.api.setRulerRuleGroup).toHaveBeenNthCalledWith(1, { dataSourceName: testDatasources.prom.name, apiVersion: 'legacy' }, 'namespace1', Object.assign(Object.assign({}, someRulerRules['namespace1'][0]), { name: 'super group', interval: '5m' }));
            expect(mocks.api.deleteGroup).toHaveBeenLastCalledWith({ dataSourceName: testDatasources.prom.name, apiVersion: 'legacy' }, 'namespace1', 'group1');
        }));
        testCase('edit lotex group eval interval, no renaming', () => __awaiter(void 0, void 0, void 0, function* () {
            // make changes to form
            yield userEvent.type(ui.editGroupModal.intervalInput.get(), '5m');
            // submit, check that appropriate calls were made
            yield userEvent.click(ui.editGroupModal.saveButton.get());
            yield waitFor(() => expect(ui.editGroupModal.namespaceInput.query()).not.toBeInTheDocument());
            expect(mocks.api.setRulerRuleGroup).toHaveBeenCalledTimes(1);
            expect(mocks.api.deleteGroup).not.toHaveBeenCalled();
            expect(mocks.api.deleteNamespace).not.toHaveBeenCalled();
            expect(mocks.api.fetchRulerRules).toHaveBeenCalledTimes(4);
            expect(mocks.api.setRulerRuleGroup).toHaveBeenNthCalledWith(1, { dataSourceName: testDatasources.prom.name, apiVersion: 'legacy' }, 'namespace1', Object.assign(Object.assign({}, someRulerRules['namespace1'][0]), { interval: '5m' }));
        }));
    });
    describe('RBAC Enabled', () => {
        describe('Export button', () => {
            it('Export button should be visible when the user has alert read permissions', () => __awaiter(void 0, void 0, void 0, function* () {
                grantUserPermissions([AccessControlAction.AlertingRuleRead, AccessControlAction.FoldersRead]);
                mocks.getAllDataSourcesMock.mockReturnValue([]);
                setDataSourceSrv(new MockDataSourceSrv({}));
                mocks.api.fetchRules.mockResolvedValue([
                    mockPromRuleNamespace({
                        name: 'foofolder',
                        dataSourceName: GRAFANA_RULES_SOURCE_NAME,
                        groups: [
                            mockPromRuleGroup({
                                name: 'grafana-group',
                                rules: [
                                    mockPromAlertingRule({
                                        query: '[]',
                                    }),
                                ],
                            }),
                        ],
                    }),
                ]);
                mocks.api.fetchRulerRules.mockResolvedValue({});
                renderRuleList();
                yield userEvent.click(ui.moreButton.get());
                expect(ui.exportButton.get()).toBeInTheDocument();
            }));
        });
        describe('Grafana Managed Alerts', () => {
            it('New alert button should be visible when the user has alert rule create and folder read permissions and no rules exists', () => __awaiter(void 0, void 0, void 0, function* () {
                grantUserPermissions([
                    AccessControlAction.FoldersRead,
                    AccessControlAction.AlertingRuleCreate,
                    AccessControlAction.AlertingRuleRead,
                ]);
                mocks.getAllDataSourcesMock.mockReturnValue([]);
                setDataSourceSrv(new MockDataSourceSrv({}));
                mocks.api.fetchRules.mockResolvedValue([]);
                mocks.api.fetchRulerRules.mockResolvedValue({});
                renderRuleList();
                yield waitFor(() => expect(mocks.api.fetchRules).toHaveBeenCalledTimes(1));
                expect(ui.newRuleButton.get()).toBeInTheDocument();
            }));
            it('New alert button should be visible when the user has alert rule create and folder read permissions and rules already exists', () => __awaiter(void 0, void 0, void 0, function* () {
                grantUserPermissions([
                    AccessControlAction.FoldersRead,
                    AccessControlAction.AlertingRuleCreate,
                    AccessControlAction.AlertingRuleRead,
                ]);
                mocks.getAllDataSourcesMock.mockReturnValue([]);
                setDataSourceSrv(new MockDataSourceSrv({}));
                mocks.api.fetchRules.mockResolvedValue(somePromRules('grafana'));
                mocks.api.fetchRulerRules.mockResolvedValue(someRulerRules);
                renderRuleList();
                yield waitFor(() => expect(mocks.api.fetchRules).toHaveBeenCalledTimes(1));
                expect(ui.newRuleButton.get()).toBeInTheDocument();
            }));
        });
        describe('Cloud Alerts', () => {
            it('New alert button should be visible when the user has the alert rule external write and datasource read permissions and no rules exists', () => __awaiter(void 0, void 0, void 0, function* () {
                grantUserPermissions([
                    // AccessControlAction.AlertingRuleRead,
                    AccessControlAction.DataSourcesRead,
                    AccessControlAction.AlertingRuleExternalRead,
                    AccessControlAction.AlertingRuleExternalWrite,
                ]);
                mocks.getAllDataSourcesMock.mockReturnValue([dataSources.prom]);
                setDataSourceSrv(new MockDataSourceSrv({ prom: dataSources.prom }));
                mocks.api.discoverFeatures.mockResolvedValue({
                    application: PromApplication.Cortex,
                    features: {
                        rulerApiEnabled: true,
                    },
                });
                mocks.api.fetchRules.mockResolvedValue([]);
                mocks.api.fetchRulerRules.mockResolvedValue({});
                renderRuleList();
                yield waitFor(() => expect(mocks.api.fetchRules).toHaveBeenCalledTimes(1));
                expect(ui.newRuleButton.get()).toBeInTheDocument();
            }));
            it('New alert button should be visible when the user has the alert rule external write and data source read permissions and rules already exists', () => __awaiter(void 0, void 0, void 0, function* () {
                grantUserPermissions([
                    AccessControlAction.DataSourcesRead,
                    AccessControlAction.AlertingRuleExternalRead,
                    AccessControlAction.AlertingRuleExternalWrite,
                ]);
                mocks.getAllDataSourcesMock.mockReturnValue([dataSources.prom]);
                setDataSourceSrv(new MockDataSourceSrv({ prom: dataSources.prom }));
                mocks.api.discoverFeatures.mockResolvedValue({
                    application: PromApplication.Cortex,
                    features: {
                        rulerApiEnabled: true,
                    },
                });
                mocks.api.fetchRules.mockResolvedValue(somePromRules('Cortex'));
                mocks.api.fetchRulerRules.mockResolvedValue(someRulerRules);
                renderRuleList();
                yield waitFor(() => expect(mocks.api.fetchRules).toHaveBeenCalledTimes(1));
                expect(ui.newRuleButton.get()).toBeInTheDocument();
            }));
        });
    });
    describe('Analytics', () => {
        it('Sends log info when creating an alert rule from a scratch', () => __awaiter(void 0, void 0, void 0, function* () {
            grantUserPermissions([
                AccessControlAction.FoldersRead,
                AccessControlAction.AlertingRuleCreate,
                AccessControlAction.AlertingRuleRead,
            ]);
            mocks.getAllDataSourcesMock.mockReturnValue([]);
            setDataSourceSrv(new MockDataSourceSrv({}));
            mocks.api.fetchRules.mockResolvedValue([]);
            mocks.api.fetchRulerRules.mockResolvedValue({});
            renderRuleList();
            yield waitFor(() => expect(mocks.api.fetchRules).toHaveBeenCalledTimes(1));
            const button = screen.getByText('New alert rule');
            button.addEventListener('click', (event) => event.preventDefault(), false);
            expect(button).toBeEnabled();
            yield userEvent.click(button);
            expect(logInfo).toHaveBeenCalledWith(LogMessages.alertRuleFromScratch);
        }));
    });
});
//# sourceMappingURL=RuleList.test.js.map