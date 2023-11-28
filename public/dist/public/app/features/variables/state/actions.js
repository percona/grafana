import { __awaiter } from "tslib";
import { castArray, isEqual } from 'lodash';
import { getDataSourceRef, isDataSourceRef, isEmptyObject, LoadingState, } from '@grafana/data';
import { config, locationService } from '@grafana/runtime';
import { notifyApp } from 'app/core/actions';
import { contextSrv } from 'app/core/services/context_srv';
import { getTimeSrv } from 'app/features/dashboard/services/TimeSrv';
import { store } from 'app/store/store';
import { createErrorNotification } from '../../../core/copy/appNotification';
import { appEvents } from '../../../core/core';
import { getBackendSrv } from '../../../core/services/backend_srv';
import { Graph } from '../../../core/utils/dag';
import { getDatasourceSrv } from '../../plugins/datasource_srv';
import { getTemplateSrv } from '../../templating/template_srv';
import { variableAdapters } from '../adapters';
import { ALL_VARIABLE_TEXT, ALL_VARIABLE_VALUE, VARIABLE_PREFIX } from '../constants';
import { cleanEditorState } from '../editor/reducer';
import { hasCurrent, hasLegacyVariableSupport, hasOptions, hasStandardVariableSupport, isAdHoc, isConstant, isMulti, isQuery, } from '../guard';
import { getAllAffectedPanelIdsForVariableChange, getPanelVars } from '../inspect/utils';
import { cleanPickerState } from '../pickers/OptionsPicker/reducer';
import { alignCurrentWithMulti } from '../shared/multiOptions';
import { initialVariableModelState, TransactionStatus, VariableHide, VariableRefresh, VariablesChanged, VariablesChangedInUrl, VariablesTimeRangeProcessDone, } from '../types';
import { ensureStringValues, getCurrentText, getCurrentValue, getVariableRefresh, hasOngoingTransaction, toKeyedVariableIdentifier, toStateKey, toVariablePayload, } from '../utils';
import { findVariableNodeInList, isVariableOnTimeRangeConfigured } from './helpers';
import { toKeyedAction } from './keyedVariablesReducer';
import { getIfExistsLastKey, getVariable, getVariablesByKey, getVariablesState } from './selectors';
import { addVariable, changeVariableProp, setCurrentVariableValue, variableStateCompleted, variableStateFailed, variableStateFetching, variableStateNotStarted, } from './sharedReducer';
import { variablesClearTransaction, variablesCompleteTransaction, variablesInitTransaction, } from './transactionReducer';
import { cleanVariables } from './variablesReducer';
// process flow queryVariable
// thunk => processVariables
//    adapter => setValueFromUrl
//      thunk => setOptionFromUrl
//        adapter => updateOptions
//          thunk => updateQueryVariableOptions
//            action => updateVariableOptions
//            action => updateVariableTags
//            thunk => validateVariableSelectionState
//              adapter => setValue
//                thunk => setOptionAsCurrent
//                  action => setCurrentVariableValue
//                  thunk => variableUpdated
//                    adapter => updateOptions for dependent nodes
//        adapter => setValue
//          thunk => setOptionAsCurrent
//            action => setCurrentVariableValue
//            thunk => variableUpdated
//              adapter => updateOptions for dependent nodes
//    adapter => updateOptions
//      thunk => updateQueryVariableOptions
//        action => updateVariableOptions
//        action => updateVariableTags
//        thunk => validateVariableSelectionState
//          adapter => setValue
//            thunk => setOptionAsCurrent
//              action => setCurrentVariableValue
//              thunk => variableUpdated
//                adapter => updateOptions for dependent nodes
export const initDashboardTemplating = (key, dashboard) => {
    return (dispatch, getState) => {
        let orderIndex = 0;
        const list = dashboard.templating.list;
        for (let index = 0; index < list.length; index++) {
            const model = fixSelectedInconsistency(list[index]);
            model.rootStateKey = key;
            if (!variableAdapters.getIfExists(model.type)) {
                continue;
            }
            dispatch(toKeyedAction(key, addVariable(toVariablePayload(model, { global: false, index: orderIndex++, model }))));
        }
        getTemplateSrv().updateTimeRange(getTimeSrv().timeRange());
        const variables = getVariablesByKey(key, getState());
        for (const variable of variables) {
            dispatch(toKeyedAction(key, variableStateNotStarted(toVariablePayload(variable))));
        }
    };
};
export function fixSelectedInconsistency(model) {
    if (!hasOptions(model)) {
        return model;
    }
    let found = false;
    for (const option of model.options) {
        option.selected = false;
        if (Array.isArray(model.current.value)) {
            for (const value of model.current.value) {
                if (option.value === value) {
                    option.selected = found = true;
                }
            }
        }
        else if (option.value === model.current.value) {
            option.selected = found = true;
        }
    }
    if (!found && model.options.length) {
        model.options[0].selected = true;
    }
    return model;
}
export const addSystemTemplateVariables = (key, dashboard) => {
    return (dispatch) => {
        const dashboardModel = Object.assign(Object.assign({}, initialVariableModelState), { id: '__dashboard', name: '__dashboard', type: 'system', index: -3, skipUrlSync: true, hide: VariableHide.hideVariable, current: {
                value: {
                    name: dashboard.title,
                    uid: dashboard.uid,
                    toString: () => dashboard.title,
                },
            } });
        dispatch(toKeyedAction(key, addVariable(toVariablePayload(dashboardModel, {
            global: dashboardModel.global,
            index: dashboardModel.index,
            model: dashboardModel,
        }))));
        const orgModel = Object.assign(Object.assign({}, initialVariableModelState), { id: '__org', name: '__org', type: 'system', index: -2, skipUrlSync: true, hide: VariableHide.hideVariable, current: {
                value: {
                    name: contextSrv.user.orgName,
                    id: contextSrv.user.orgId,
                    toString: () => contextSrv.user.orgId.toString(),
                },
            } });
        dispatch(toKeyedAction(key, addVariable(toVariablePayload(orgModel, { global: orgModel.global, index: orgModel.index, model: orgModel }))));
        const userModel = Object.assign(Object.assign({}, initialVariableModelState), { id: '__user', name: '__user', type: 'system', index: -1, skipUrlSync: true, hide: VariableHide.hideVariable, current: {
                value: {
                    login: contextSrv.user.login,
                    id: contextSrv.user.id,
                    email: contextSrv.user.email,
                    toString: () => contextSrv.user.id.toString(),
                },
            } });
        dispatch(toKeyedAction(key, addVariable(toVariablePayload(userModel, { global: userModel.global, index: userModel.index, model: userModel }))));
    };
};
export const changeVariableMultiValue = (identifier, multi) => {
    return (dispatch, getState) => {
        const { rootStateKey: key } = identifier;
        const variable = getVariable(identifier, getState());
        if (!isMulti(variable) || isEmptyObject(variable.current)) {
            return;
        }
        const current = alignCurrentWithMulti(variable.current, multi);
        dispatch(toKeyedAction(key, changeVariableProp(toVariablePayload(identifier, { propName: 'multi', propValue: multi }))));
        dispatch(toKeyedAction(key, changeVariableProp(toVariablePayload(identifier, { propName: 'current', propValue: current }))));
    };
};
export const processVariableDependencies = (variable, state) => __awaiter(void 0, void 0, void 0, function* () {
    if (!variable.rootStateKey) {
        throw new Error(`rootStateKey not found for variable with id:${variable.id}`);
    }
    if (isDependencyGraphCircular(variable, state)) {
        throw new Error('Circular dependency in dashboard variables detected. Dashboard may not work as expected.');
    }
    const dependencies = getDirectDependencies(variable, state);
    if (!isWaitingForDependencies(variable.rootStateKey, dependencies, state)) {
        return;
    }
    yield new Promise((resolve) => {
        const unsubscribe = store.subscribe(() => {
            if (!variable.rootStateKey) {
                throw new Error(`rootStateKey not found for variable with id:${variable.id}`);
            }
            if (!isWaitingForDependencies(variable.rootStateKey, dependencies, store.getState())) {
                unsubscribe();
                resolve();
            }
        });
    });
});
const isDependencyGraphCircular = (variable, state, encounteredDependencyIds = new Set()) => {
    if (encounteredDependencyIds.has(variable.id)) {
        return true;
    }
    encounteredDependencyIds = new Set([...encounteredDependencyIds, variable.id]);
    return getDirectDependencies(variable, state).some((dependency) => {
        return isDependencyGraphCircular(dependency, state, encounteredDependencyIds);
    });
};
const getDirectDependencies = (variable, state) => {
    if (!variable.rootStateKey) {
        return [];
    }
    const directDependencies = [];
    for (const otherVariable of getVariablesByKey(variable.rootStateKey, state)) {
        if (variable === otherVariable) {
            continue;
        }
        if (variableAdapters.getIfExists(variable.type)) {
            if (variableAdapters.get(variable.type).dependsOn(variable, otherVariable)) {
                directDependencies.push(otherVariable);
            }
        }
    }
    return directDependencies;
};
const isWaitingForDependencies = (key, dependencies, state) => {
    if (dependencies.length === 0) {
        return false;
    }
    const variables = getVariablesByKey(key, state);
    const notCompletedDependencies = dependencies.filter((d) => variables.some((v) => v.id === d.id && (v.state === LoadingState.NotStarted || v.state === LoadingState.Loading)));
    return notCompletedDependencies.length > 0;
};
export const processVariable = (identifier, queryParams) => {
    return (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
        const variable = getVariable(identifier, getState());
        yield processVariableDependencies(variable, getState());
        const urlValue = queryParams[VARIABLE_PREFIX + variable.name];
        if (urlValue !== void 0) {
            const stringUrlValue = ensureStringValues(urlValue);
            yield variableAdapters.get(variable.type).setValueFromUrl(variable, stringUrlValue);
            return;
        }
        if (variable.hasOwnProperty('refresh')) {
            const refreshableVariable = variable;
            if (refreshableVariable.refresh === VariableRefresh.onDashboardLoad ||
                refreshableVariable.refresh === VariableRefresh.onTimeRangeChanged) {
                yield dispatch(updateOptions(toKeyedVariableIdentifier(refreshableVariable)));
                return;
            }
        }
        if (variable.type === 'custom') {
            yield dispatch(updateOptions(toKeyedVariableIdentifier(variable)));
            return;
        }
        // for variables that aren't updated via URL or refresh, let's simulate the same state changes
        dispatch(completeVariableLoading(identifier));
    });
};
export const processVariables = (key) => {
    return (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = locationService.getSearchObject();
        const promises = getVariablesByKey(key, getState()).map((variable) => __awaiter(void 0, void 0, void 0, function* () { return yield dispatch(processVariable(toKeyedVariableIdentifier(variable), queryParams)); }));
        yield Promise.all(promises);
    });
};
export const setOptionFromUrl = (identifier, urlValue) => {
    return (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
        const stringUrlValue = ensureStringValues(urlValue);
        const variable = getVariable(identifier, getState());
        if (getVariableRefresh(variable) !== VariableRefresh.never) {
            // updates options
            yield dispatch(updateOptions(toKeyedVariableIdentifier(variable)));
        }
        // get variable from state
        const variableFromState = getVariable(toKeyedVariableIdentifier(variable), getState());
        if (!hasOptions(variableFromState)) {
            return;
        }
        if (!variableFromState) {
            throw new Error(`Couldn't find variable with name: ${variable.name}`);
        }
        // Simple case. Value in URL matches existing options text or value.
        let option = variableFromState.options.find((op) => {
            return op.text === stringUrlValue || op.value === stringUrlValue;
        });
        if (!option && isMulti(variableFromState)) {
            if (variableFromState.allValue && stringUrlValue === variableFromState.allValue) {
                option = { text: ALL_VARIABLE_TEXT, value: ALL_VARIABLE_VALUE, selected: false };
            }
        }
        if (!option) {
            let defaultText = stringUrlValue;
            const defaultValue = stringUrlValue;
            if (Array.isArray(stringUrlValue)) {
                // Multiple values in the url. We construct text as a list of texts from all matched options.
                defaultText = stringUrlValue.reduce((acc, item) => {
                    const foundOption = variableFromState.options.find((o) => o.value === item);
                    if (!foundOption) {
                        // @ts-ignore according to strict null errors this can never happen
                        // TODO: investigate this further or refactor code
                        return [].concat(acc, [item]);
                    }
                    // @ts-ignore according to strict null errors this can never happen
                    // TODO: investigate this further or refactor code
                    return [].concat(acc, [foundOption.text]);
                }, []);
            }
            // It is possible that we did not match the value to any existing option. In that case the URL value will be
            // used anyway for both text and value.
            option = { text: defaultText, value: defaultValue, selected: false };
        }
        if (isMulti(variableFromState)) {
            // In case variable is multiple choice, we cast to array to preserve the same behavior as when selecting
            // the option directly, which will return even single value in an array.
            option = alignCurrentWithMulti({ text: castArray(option.text), value: castArray(option.value), selected: false }, variableFromState.multi);
        }
        yield variableAdapters.get(variable.type).setValue(variableFromState, option);
    });
};
export const selectOptionsForCurrentValue = (variable) => {
    let i, y, value, option;
    const selected = [];
    for (i = 0; i < variable.options.length; i++) {
        option = Object.assign({}, variable.options[i]);
        option.selected = false;
        if (Array.isArray(variable.current.value)) {
            for (y = 0; y < variable.current.value.length; y++) {
                value = variable.current.value[y];
                if (option.value === value) {
                    option.selected = true;
                    selected.push(option);
                }
            }
        }
        else if (option.value === variable.current.value) {
            option.selected = true;
            selected.push(option);
        }
    }
    return selected;
};
export const validateVariableSelectionState = (identifier, defaultValue) => {
    return (dispatch, getState) => {
        var _a, _b;
        const variableInState = getVariable(identifier, getState());
        if (!hasOptions(variableInState)) {
            return Promise.resolve();
        }
        const current = variableInState.current || {};
        const setValue = variableAdapters.get(variableInState.type).setValue;
        if (Array.isArray(current.value)) {
            const selected = selectOptionsForCurrentValue(variableInState);
            // if none pick first
            if (selected.length === 0) {
                const option = variableInState.options[0];
                return setValue(variableInState, option);
            }
            const option = {
                value: selected.map((v) => v.value),
                text: selected.map((v) => v.text),
                selected: true,
            };
            return setValue(variableInState, option);
        }
        let option = null;
        // 1. find the current value
        const text = getCurrentText(variableInState);
        const value = getCurrentValue(variableInState);
        option = (_a = variableInState.options) === null || _a === void 0 ? void 0 : _a.find((v) => v.text === text || v.value === value);
        if (option) {
            return setValue(variableInState, option);
        }
        // 2. find the default value
        if (defaultValue) {
            option = (_b = variableInState.options) === null || _b === void 0 ? void 0 : _b.find((v) => v.text === defaultValue || v.value === defaultValue);
            if (option) {
                return setValue(variableInState, option);
            }
        }
        // 3. use the first value
        if (variableInState.options) {
            const option = variableInState.options[0];
            if (option) {
                return setValue(variableInState, option);
            }
        }
        // 4... give up
        return Promise.resolve();
    };
};
export const setOptionAsCurrent = (identifier, current, emitChanges) => {
    return (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
        const { rootStateKey: key } = identifier;
        dispatch(toKeyedAction(key, setCurrentVariableValue(toVariablePayload(identifier, { option: current }))));
        return yield dispatch(variableUpdated(identifier, emitChanges));
    });
};
export const createGraph = (variables) => {
    const g = new Graph();
    variables.forEach((v) => {
        g.createNode(v.name);
    });
    variables.forEach((v1) => {
        variables.forEach((v2) => {
            if (v1 === v2) {
                return;
            }
            if (variableAdapters.get(v1.type).dependsOn(v1, v2)) {
                g.link(v1.name, v2.name);
            }
        });
    });
    return g;
};
export const variableUpdated = (identifier, emitChangeEvents, events = appEvents) => {
    return (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const state = getState();
        const { rootStateKey } = identifier;
        const variableInState = getVariable(identifier, state);
        // if we're initializing variables ignore cascading update because we are in a boot up scenario
        if (getVariablesState(rootStateKey, state).transaction.status === TransactionStatus.Fetching) {
            if (getVariableRefresh(variableInState) === VariableRefresh.never) {
                // for variable types with updates that go the setValueFromUrl path in the update let's make sure their state is set to Done.
                yield dispatch(upgradeLegacyQueries(toKeyedVariableIdentifier(variableInState)));
                dispatch(completeVariableLoading(identifier));
            }
            return Promise.resolve();
        }
        const variables = getVariablesByKey(rootStateKey, state);
        const g = createGraph(variables);
        const panels = (_c = (_b = (_a = state.dashboard) === null || _a === void 0 ? void 0 : _a.getModel()) === null || _b === void 0 ? void 0 : _b.panels) !== null && _c !== void 0 ? _c : [];
        const panelVars = getPanelVars(panels);
        const event = isAdHoc(variableInState)
            ? { refreshAll: true, panelIds: [] } // for adhoc variables we don't know which panels that will be impacted
            : {
                refreshAll: false,
                panelIds: Array.from(getAllAffectedPanelIdsForVariableChange([variableInState.id], g, panelVars)),
            };
        const node = g.getNode(variableInState.name);
        let promises = [];
        if (node) {
            promises = node.getOptimizedInputEdges().map((e) => {
                const variable = variables.find((v) => { var _a; return v.name === ((_a = e.inputNode) === null || _a === void 0 ? void 0 : _a.name); });
                if (!variable) {
                    return Promise.resolve();
                }
                return dispatch(updateOptions(toKeyedVariableIdentifier(variable)));
            });
        }
        return Promise.all(promises).then(() => {
            if (emitChangeEvents) {
                events.publish(new VariablesChanged(event));
                locationService.partial(getQueryWithVariables(rootStateKey, getState));
            }
        });
    });
};
const dfs = (node, visited, variables, variablesRefreshTimeRange) => {
    if (!visited.includes(node.name)) {
        visited.push(node.name);
    }
    node.outputEdges.forEach((e) => {
        const child = e.outputNode;
        if (child && !visited.includes(child.name)) {
            const childVariable = variables.find((v) => v.name === child.name);
            // when a variable is refreshed on time range change, we need to add that variable to be refreshed and mark its children as visited
            if (childVariable &&
                childVariable.refresh === VariableRefresh.onTimeRangeChanged &&
                variablesRefreshTimeRange.indexOf(childVariable) === -1) {
                variablesRefreshTimeRange.push(childVariable);
                visited.push(child.name);
            }
            else {
                dfs(child, visited, variables, variablesRefreshTimeRange);
            }
        }
    });
    return variablesRefreshTimeRange;
};
// verify if the output edges of a node are not time range dependent
const areOuputEdgesNotTimeRange = (node, variables) => {
    return node.outputEdges.every((e) => {
        const childNode = e.outputNode;
        if (childNode) {
            const childVariable = findVariableNodeInList(variables, childNode.name);
            if (childVariable && childVariable.type === 'query') {
                return childVariable.refresh !== VariableRefresh.onTimeRangeChanged;
            }
        }
        return true;
    });
};
/**
 * This function returns a list of variables that need to be refreshed when the time range changes
 * It follows this logic
 * Create a graph based on all template variables.
 * Loop through all the variables and perform the following checks for each variable:
 *
 * -- a) If a variable A is a query variable, it’s time range, and has no dependent nodes
 * ----- it should be added to the variablesRefreshTimeRange.
 *
 * -- b) If a variable A is a query variable, it’s time range, and has dependent nodes (B, C)
 * ----- 1. add the variable A to variablesRefreshTimeRange
 * ----- 2. skip all the dependent nodes (B, C).
 *       Here, we should traverse the tree using DFS (Depth First Search), as the dependent nodes will be updated in cascade when the parent variable is updated.
 */
export const getVariablesThatNeedRefreshNew = (key, state) => {
    const allVariables = getVariablesByKey(key, state);
    //create dependency graph
    const g = createGraph(allVariables);
    // create a list of nodes that were visited
    const visitedDfs = [];
    const variablesRefreshTimeRange = [];
    allVariables.forEach((v) => {
        const node = g.getNode(v.name);
        if (visitedDfs.includes(v.name)) {
            return;
        }
        if (node) {
            const parentVariableNode = findVariableNodeInList(allVariables, node.name);
            if (!parentVariableNode) {
                return;
            }
            const isVariableTimeRange = isVariableOnTimeRangeConfigured(parentVariableNode);
            // if variable is time range and has no output edges add it to the list of variables that need refresh
            if (isVariableTimeRange && node.outputEdges.length === 0) {
                variablesRefreshTimeRange.push(parentVariableNode);
            }
            // if variable is time range and other variables depend on it (output edges) add it to the list of variables that need refresh and dont visit its dependents
            if (isVariableTimeRange &&
                variablesRefreshTimeRange.includes(parentVariableNode) &&
                node.outputEdges.length > 0) {
                variablesRefreshTimeRange.push(parentVariableNode);
                dfs(node, visitedDfs, allVariables, variablesRefreshTimeRange);
            }
            // If is variable time range, has outputEdges, but the output edges are not time range configured, it means this
            // is the top variable that need to be refreshed
            if (isVariableTimeRange && node.outputEdges.length > 0 && areOuputEdgesNotTimeRange(node, allVariables)) {
                if (!variablesRefreshTimeRange.includes(parentVariableNode)) {
                    variablesRefreshTimeRange.push(parentVariableNode);
                }
            }
            // if variable is not time range but has dependents (output edges) visit its dependants and repeat the process
            if (!isVariableTimeRange && node.outputEdges.length > 0) {
                dfs(node, visitedDfs, allVariables, variablesRefreshTimeRange);
            }
        }
    });
    return variablesRefreshTimeRange;
};
// old approach of refreshing variables that need refresh
const getVariablesThatNeedRefreshOld = (key, state) => {
    const allVariables = getVariablesByKey(key, state);
    const variablesThatNeedRefresh = allVariables.filter((variable) => {
        if (variable.hasOwnProperty('refresh') && variable.hasOwnProperty('options')) {
            const variableWithRefresh = variable;
            return variableWithRefresh.refresh === VariableRefresh.onTimeRangeChanged;
        }
        return false;
    });
    return variablesThatNeedRefresh;
};
export const onTimeRangeUpdated = (key, timeRange, dependencies = { templateSrv: getTemplateSrv(), events: appEvents }) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    dependencies.templateSrv.updateTimeRange(timeRange);
    // approach # 2, get variables that need refresh but use the dependency graph to only update the ones that are affected
    // TODO: remove the VariableWithOptions type once the feature flag is on GA
    let variablesThatNeedRefresh = [];
    if (config.featureToggles.refactorVariablesTimeRange) {
        variablesThatNeedRefresh = getVariablesThatNeedRefreshNew(key, getState());
    }
    else {
        variablesThatNeedRefresh = getVariablesThatNeedRefreshOld(key, getState());
    }
    const variableIds = variablesThatNeedRefresh.map((variable) => variable.id);
    const promises = variablesThatNeedRefresh.map((variable) => dispatch(timeRangeUpdated(toKeyedVariableIdentifier(variable))));
    try {
        yield Promise.all(promises);
        dependencies.events.publish(new VariablesTimeRangeProcessDone({ variableIds }));
    }
    catch (error) {
        console.error(error);
        dispatch(notifyApp(createVariableErrorNotification('Template variable service failed', error)));
    }
});
export const timeRangeUpdated = (identifier) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    const variableInState = getVariable(identifier, getState());
    if (!hasOptions(variableInState)) {
        return;
    }
    const previousOptions = variableInState.options.slice();
    yield dispatch(updateOptions(toKeyedVariableIdentifier(variableInState), true));
    const updatedVariable = getVariable(identifier, getState());
    if (!hasOptions(updatedVariable)) {
        return;
    }
    const updatedOptions = updatedVariable.options;
    if (JSON.stringify(previousOptions) !== JSON.stringify(updatedOptions)) {
        const dashboard = getState().dashboard.getModel();
        dashboard === null || dashboard === void 0 ? void 0 : dashboard.templateVariableValueUpdated();
    }
});
export const templateVarsChangedInUrl = (key, vars, events = appEvents) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const update = [];
    const dashboard = getState().dashboard.getModel();
    const variables = getVariablesByKey(key, getState());
    for (const variable of variables) {
        const key = VARIABLE_PREFIX + variable.name;
        if (!vars.hasOwnProperty(key)) {
            // key not found quick exit
            continue;
        }
        if (!isVariableUrlValueDifferentFromCurrent(variable, vars[key].value)) {
            // variable values doesn't differ quick exit
            continue;
        }
        let value = vars[key].value; // as the default the value is set to the value passed into templateVarsChangedInUrl
        if (vars[key].removed) {
            // for some reason (panel|data link without variable) the variable url value (var-xyz) has been removed from the url
            // so we need to revert the value to the value stored in dashboard json
            const variableInModel = dashboard === null || dashboard === void 0 ? void 0 : dashboard.templating.list.find((v) => v.name === variable.name);
            if (variableInModel && hasCurrent(variableInModel)) {
                value = variableInModel.current.value; // revert value to the value stored in dashboard json
            }
            if (variableInModel && isConstant(variableInModel)) {
                value = variableInModel.query; // revert value to the value stored in dashboard json, constants don't store current values in dashboard json
            }
        }
        const promise = variableAdapters.get(variable.type).setValueFromUrl(variable, value);
        update.push(promise);
    }
    const filteredVars = variables.filter((v) => {
        const key = VARIABLE_PREFIX + v.name;
        return vars.hasOwnProperty(key) && isVariableUrlValueDifferentFromCurrent(v, vars[key].value) && !isAdHoc(v);
    });
    const varGraph = createGraph(variables);
    const panelVars = getPanelVars((_a = dashboard === null || dashboard === void 0 ? void 0 : dashboard.panels) !== null && _a !== void 0 ? _a : []);
    const affectedPanels = getAllAffectedPanelIdsForVariableChange(filteredVars.map((v) => v.id), varGraph, panelVars);
    if (update.length) {
        yield Promise.all(update);
        events.publish(new VariablesChangedInUrl({
            refreshAll: affectedPanels.size === 0,
            panelIds: Array.from(affectedPanels),
        }));
    }
});
export function isVariableUrlValueDifferentFromCurrent(variable, urlValue) {
    const variableValue = variableAdapters.get(variable.type).getValueForUrl(variable);
    let stringUrlValue = ensureStringValues(urlValue);
    if (Array.isArray(variableValue) && !Array.isArray(stringUrlValue)) {
        stringUrlValue = [stringUrlValue];
    }
    // lodash isEqual handles array of value equality checks as well
    return !isEqual(variableValue, stringUrlValue);
}
const getQueryWithVariables = (key, getState) => {
    const queryParams = locationService.getSearchObject();
    const queryParamsNew = Object.keys(queryParams)
        .filter((key) => key.indexOf(VARIABLE_PREFIX) === -1)
        .reduce((obj, key) => {
        obj[key] = queryParams[key];
        return obj;
    }, {});
    for (const variable of getVariablesByKey(key, getState())) {
        if (variable.skipUrlSync) {
            continue;
        }
        const adapter = variableAdapters.get(variable.type);
        queryParamsNew[VARIABLE_PREFIX + variable.name] = adapter.getValueForUrl(variable);
    }
    return queryParamsNew;
};
export const initVariablesTransaction = (urlUid, dashboard) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = toStateKey(urlUid);
        const state = getState();
        const lastKey = getIfExistsLastKey(state);
        if (lastKey) {
            const transactionState = getVariablesState(lastKey, state).transaction;
            if (transactionState.status === TransactionStatus.Fetching) {
                // previous dashboard is still fetching variables, cancel all requests
                dispatch(cancelVariables(lastKey));
            }
        }
        // Start init transaction
        dispatch(toKeyedAction(uid, variablesInitTransaction({ uid })));
        // Add system variables like __dashboard and __user
        dispatch(addSystemTemplateVariables(uid, dashboard));
        // Load all variables into redux store
        dispatch(initDashboardTemplating(uid, dashboard));
        // Migrate data source name to ref
        dispatch(migrateVariablesDatasourceNameToRef(uid));
        // Process all variable updates
        yield dispatch(processVariables(uid));
        // Set transaction as complete
        dispatch(toKeyedAction(uid, variablesCompleteTransaction({ uid })));
    }
    catch (err) {
        dispatch(notifyApp(createVariableErrorNotification('Templating init failed', err)));
        console.error(err);
    }
});
export function migrateVariablesDatasourceNameToRef(key, getDatasourceSrvFunc = getDatasourceSrv) {
    return (dispatch, getState) => {
        const variables = getVariablesByKey(key, getState());
        for (const variable of variables) {
            if (!isAdHoc(variable) && !isQuery(variable)) {
                continue;
            }
            const { datasource: nameOrRef } = variable;
            if (isDataSourceRef(nameOrRef)) {
                continue;
            }
            // the call to getInstanceSettings needs to be done after initDashboardTemplating because we might have
            // datasource variables that need to be resolved
            const ds = getDatasourceSrvFunc().getInstanceSettings(nameOrRef);
            const dsRef = ds ? getDataSourceRef(ds) : { uid: nameOrRef };
            dispatch(toKeyedAction(key, changeVariableProp(toVariablePayload(variable, { propName: 'datasource', propValue: dsRef }))));
        }
    };
}
export const cleanUpVariables = (key) => (dispatch) => {
    dispatch(toKeyedAction(key, cleanVariables()));
    dispatch(toKeyedAction(key, cleanEditorState()));
    dispatch(toKeyedAction(key, cleanPickerState()));
    dispatch(toKeyedAction(key, variablesClearTransaction()));
};
export const cancelVariables = (key, dependencies = { getBackendSrv: getBackendSrv }) => (dispatch) => {
    dependencies.getBackendSrv().cancelAllInFlightRequests();
    dispatch(cleanUpVariables(key));
};
export const updateOptions = (identifier, rethrow = false) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    const { rootStateKey } = identifier;
    try {
        if (!hasOngoingTransaction(rootStateKey, getState())) {
            // we might have cancelled a batch so then variable state is removed
            return;
        }
        const variableInState = getVariable(identifier, getState());
        dispatch(toKeyedAction(rootStateKey, variableStateFetching(toVariablePayload(variableInState))));
        yield dispatch(upgradeLegacyQueries(toKeyedVariableIdentifier(variableInState)));
        yield variableAdapters.get(variableInState.type).updateOptions(variableInState);
        dispatch(completeVariableLoading(identifier));
    }
    catch (error) {
        dispatch(toKeyedAction(rootStateKey, variableStateFailed(toVariablePayload(identifier, { error }))));
        if (!rethrow) {
            console.error(error);
            dispatch(notifyApp(createVariableErrorNotification('Error updating options:', error, identifier)));
        }
        if (rethrow) {
            throw error;
        }
    }
});
export const createVariableErrorNotification = (message, error, identifier) => createErrorNotification(`${identifier ? `Templating [${identifier.id}]` : 'Templating'}`, `${message} ${error.message}`);
export const completeVariableLoading = (identifier) => (dispatch, getState) => {
    const { rootStateKey } = identifier;
    if (!hasOngoingTransaction(rootStateKey, getState())) {
        // we might have cancelled a batch so then variable state is removed
        return;
    }
    const variableInState = getVariable(identifier, getState());
    if (variableInState.state !== LoadingState.Done) {
        dispatch(toKeyedAction(identifier.rootStateKey, variableStateCompleted(toVariablePayload(variableInState))));
    }
};
export function upgradeLegacyQueries(identifier, getDatasourceSrvFunc = getDatasourceSrv) {
    return function (dispatch, getState) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { id, rootStateKey } = identifier;
            if (!hasOngoingTransaction(rootStateKey, getState())) {
                // we might have cancelled a batch so then variable state is removed
                return;
            }
            const variable = getVariable(identifier, getState());
            if (variable.type !== 'query') {
                return;
            }
            try {
                const datasource = yield getDatasourceSrvFunc().get((_a = variable.datasource) !== null && _a !== void 0 ? _a : '');
                if (hasLegacyVariableSupport(datasource)) {
                    return;
                }
                if (!hasStandardVariableSupport(datasource)) {
                    return;
                }
                if (isDataQueryType(variable.query)) {
                    return;
                }
                const query = {
                    refId: `${datasource.name}-${id}-Variable-Query`,
                    query: variable.query,
                };
                dispatch(toKeyedAction(rootStateKey, changeVariableProp(toVariablePayload(identifier, { propName: 'query', propValue: query }))));
            }
            catch (err) {
                dispatch(notifyApp(createVariableErrorNotification('Failed to upgrade legacy queries', err)));
                console.error(err);
            }
        });
    };
}
function isDataQueryType(query) {
    if (!query) {
        return false;
    }
    return query.hasOwnProperty('refId') && typeof query.refId === 'string';
}
//# sourceMappingURL=actions.js.map