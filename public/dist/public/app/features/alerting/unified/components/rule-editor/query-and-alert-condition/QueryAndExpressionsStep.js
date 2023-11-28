import { __rest } from "tslib";
import { css } from '@emotion/css';
import { cloneDeep } from 'lodash';
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getDefaultRelativeTimeRange } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Stack } from '@grafana/experimental';
import { config, getDataSourceSrv } from '@grafana/runtime';
import { Alert, Button, Dropdown, Field, Icon, InputControl, Menu, MenuItem, Tooltip, useStyles2 } from '@grafana/ui';
import { Text } from '@grafana/ui/src/components/Text/Text';
import { isExpressionQuery } from 'app/features/expressions/guards';
import { ExpressionDatasourceUID, ExpressionQueryType, expressionTypes } from 'app/features/expressions/types';
import { useDispatch } from 'app/types';
import { useRulesSourcesWithRuler } from '../../../hooks/useRuleSourcesWithRuler';
import { fetchAllPromBuildInfoAction } from '../../../state/actions';
import { RuleFormType } from '../../../types/rule-form';
import { getDefaultOrFirstCompatibleDataSource } from '../../../utils/datasource';
import { isPromOrLokiQuery } from '../../../utils/rule-form';
import { ExpressionEditor } from '../ExpressionEditor';
import { ExpressionsEditor } from '../ExpressionsEditor';
import { NeedHelpInfo } from '../NeedHelpInfo';
import { QueryEditor } from '../QueryEditor';
import { RecordingRuleEditor } from '../RecordingRuleEditor';
import { RuleEditorSection } from '../RuleEditorSection';
import { errorFromCurrentCondition, errorFromPreviewData, findRenamedDataQueryReferences, refIdExists } from '../util';
import { CloudDataSourceSelector } from './CloudDataSourceSelector';
import { SmartAlertTypeDetector } from './SmartAlertTypeDetector';
import { addExpressions, addNewDataQuery, addNewExpression, duplicateQuery, queriesAndExpressionsReducer, removeExpression, removeExpressions, rewireExpressions, setDataQueries, setRecordingRulesQueries, updateExpression, updateExpressionRefId, updateExpressionTimeRange, updateExpressionType, } from './reducer';
import { useAlertQueryRunner } from './useAlertQueryRunner';
export const QueryAndExpressionsStep = ({ editingExistingRule, onDataChange }) => {
    var _a, _b, _c, _d;
    const { setValue, getValues, watch, formState: { errors }, control, } = useFormContext();
    const { queryPreviewData, runQueries, cancelQueries, isPreviewLoading, clearPreviewData } = useAlertQueryRunner();
    const initialState = {
        queries: getValues('queries'),
    };
    const [{ queries }, dispatch] = useReducer(queriesAndExpressionsReducer, initialState);
    const [type, condition, dataSourceName] = watch(['type', 'condition', 'dataSourceName']);
    const isGrafanaManagedType = type === RuleFormType.grafana;
    const isRecordingRuleType = type === RuleFormType.cloudRecording;
    const isCloudAlertRuleType = type === RuleFormType.cloudAlerting;
    const dispatchReduxAction = useDispatch();
    useEffect(() => {
        dispatchReduxAction(fetchAllPromBuildInfoAction());
    }, [dispatchReduxAction]);
    const rulesSourcesWithRuler = useRulesSourcesWithRuler();
    const runQueriesPreview = useCallback(() => {
        if (isCloudAlertRuleType) {
            // we will skip preview for cloud rules, these do not have any time series preview
            // Grafana Managed rules and recording rules do
            return;
        }
        runQueries(getValues('queries'));
    }, [isCloudAlertRuleType, runQueries, getValues]);
    // whenever we update the queries we have to update the form too
    useEffect(() => {
        setValue('queries', queries, { shouldValidate: false });
    }, [queries, runQueries, setValue]);
    const noCompatibleDataSources = getDefaultOrFirstCompatibleDataSource() === undefined;
    // data queries only
    const dataQueries = useMemo(() => {
        return queries.filter((query) => !isExpressionQuery(query.model));
    }, [queries]);
    // expression queries only
    const expressionQueries = useMemo(() => {
        return queries.filter((query) => isExpressionQuery(query.model));
    }, [queries]);
    const emptyQueries = queries.length === 0;
    // apply some validations and asserts to the results of the evaluation when creating or editing
    // Grafana-managed alert rules
    useEffect(() => {
        var _a;
        if (!isGrafanaManagedType) {
            return;
        }
        const currentCondition = getValues('condition');
        if (!currentCondition) {
            return;
        }
        const previewData = queryPreviewData[currentCondition];
        if (!previewData) {
            return;
        }
        const error = (_a = errorFromPreviewData(previewData)) !== null && _a !== void 0 ? _a : errorFromCurrentCondition(previewData);
        onDataChange((error === null || error === void 0 ? void 0 : error.message) || '');
    }, [queryPreviewData, getValues, onDataChange, isGrafanaManagedType]);
    const handleSetCondition = useCallback((refId) => {
        if (!refId) {
            return;
        }
        runQueriesPreview(); //we need to run the queries to know if the condition is valid
        setValue('condition', refId);
    }, [runQueriesPreview, setValue]);
    const onUpdateRefId = useCallback((oldRefId, newRefId) => {
        const newRefIdExists = refIdExists(queries, newRefId);
        // TODO we should set an error and explain what went wrong instead of just refusing to update
        if (newRefIdExists) {
            return;
        }
        dispatch(updateExpressionRefId({ oldRefId, newRefId }));
        // update condition too if refId was updated
        if (condition === oldRefId) {
            handleSetCondition(newRefId);
        }
    }, [condition, queries, handleSetCondition]);
    const updateExpressionAndDatasource = useSetExpressionAndDataSource();
    const onChangeQueries = useCallback((updatedQueries) => {
        // Most data sources triggers onChange and onRunQueries consecutively
        // It means our reducer state is always one step behind when runQueries is invoked
        // Invocation cycle => onChange -> dispatch(setDataQueries) -> onRunQueries -> setDataQueries Reducer
        // As a workaround we update form values as soon as possible to avoid stale state
        // This way we can access up to date queries in runQueriesPreview without waiting for re-render
        setValue('queries', updatedQueries, { shouldValidate: false });
        updateExpressionAndDatasource(updatedQueries);
        dispatch(setDataQueries(updatedQueries));
        dispatch(updateExpressionTimeRange());
        // check if we need to rewire expressions (and which ones)
        const [oldRefId, newRefId] = findRenamedDataQueryReferences(queries, updatedQueries);
        if (oldRefId && newRefId) {
            dispatch(rewireExpressions({ oldRefId, newRefId }));
        }
    }, [queries, setValue, updateExpressionAndDatasource]);
    const onChangeRecordingRulesQueries = useCallback((updatedQueries) => {
        const query = updatedQueries[0];
        if (!isPromOrLokiQuery(query.model)) {
            return;
        }
        const expression = query.model.expr;
        setValue('queries', updatedQueries, { shouldValidate: false });
        updateExpressionAndDatasource(updatedQueries);
        dispatch(setRecordingRulesQueries({ recordingRuleQueries: updatedQueries, expression }));
        runQueriesPreview();
    }, [runQueriesPreview, setValue, updateExpressionAndDatasource]);
    const recordingRuleDefaultDatasource = rulesSourcesWithRuler[0];
    useEffect(() => {
        var _a;
        clearPreviewData();
        if (type === RuleFormType.cloudRecording) {
            const expr = getValues('expression');
            if (!recordingRuleDefaultDatasource) {
                return;
            }
            const datasourceUid = (editingExistingRule && ((_a = getDataSourceSrv().getInstanceSettings(dataSourceName)) === null || _a === void 0 ? void 0 : _a.uid)) ||
                recordingRuleDefaultDatasource.uid;
            const defaultQuery = {
                refId: 'A',
                datasourceUid,
                queryType: '',
                relativeTimeRange: getDefaultRelativeTimeRange(),
                expr,
                model: {
                    refId: 'A',
                    hide: false,
                    expr,
                },
            };
            dispatch(setRecordingRulesQueries({ recordingRuleQueries: [defaultQuery], expression: expr }));
        }
    }, [type, recordingRuleDefaultDatasource, editingExistingRule, getValues, dataSourceName, clearPreviewData]);
    const onDuplicateQuery = useCallback((query) => {
        dispatch(duplicateQuery(query));
    }, []);
    // update the condition if it's been removed
    useEffect(() => {
        var _a, _b;
        if (!refIdExists(queries, condition)) {
            const lastRefId = (_b = (_a = queries.at(-1)) === null || _a === void 0 ? void 0 : _a.refId) !== null && _b !== void 0 ? _b : null;
            handleSetCondition(lastRefId);
        }
    }, [condition, queries, handleSetCondition]);
    const onClickType = useCallback((type) => {
        dispatch(addNewExpression(type));
    }, [dispatch]);
    const styles = useStyles2(getStyles);
    // Cloud alerts load data from form values
    // whereas Grafana managed alerts load data from reducer
    //when data source is changed in the cloud selector we need to update the queries in the reducer
    const onChangeCloudDatasource = useCallback((datasourceUid) => {
        const newQueries = cloneDeep(queries);
        newQueries[0].datasourceUid = datasourceUid;
        setValue('queries', newQueries, { shouldValidate: false });
        updateExpressionAndDatasource(newQueries);
        dispatch(setDataQueries(newQueries));
    }, [queries, setValue, updateExpressionAndDatasource, dispatch]);
    // ExpressionEditor for cloud query needs to update queries in the reducer and in the form
    // otherwise the value is not updated for Grafana managed alerts
    const onChangeExpression = (value) => {
        const newQueries = cloneDeep(queries);
        if (newQueries[0].model) {
            if (isPromOrLokiQuery(newQueries[0].model)) {
                newQueries[0].model.expr = value;
            }
            else {
                // first time we come from grafana-managed type
                // we need to convert the model to PromOrLokiQuery
                const promLoki = Object.assign(Object.assign({}, cloneDeep(newQueries[0].model)), { expr: value });
                newQueries[0].model = promLoki;
            }
        }
        setValue('queries', newQueries, { shouldValidate: false });
        updateExpressionAndDatasource(newQueries);
        dispatch(setDataQueries(newQueries));
        runQueriesPreview();
    };
    const removeExpressionsInQueries = useCallback(() => dispatch(removeExpressions()), [dispatch]);
    const addExpressionsInQueries = useCallback((expressions) => dispatch(addExpressions(expressions)), [dispatch]);
    // we need to keep track of the previous expressions and condition reference to be able to restore them when switching back to grafana managed
    const [prevExpressions, setPrevExpressions] = useState([]);
    const [prevCondition, setPrevCondition] = useState(null);
    const restoreExpressionsInQueries = useCallback(() => {
        addExpressionsInQueries(prevExpressions);
    }, [prevExpressions, addExpressionsInQueries]);
    const onClickSwitch = useCallback(() => {
        var _a;
        const typeInForm = getValues('type');
        console.log({ typeInForm });
        if (typeInForm === RuleFormType.cloudAlerting) {
            setValue('type', RuleFormType.grafana);
            setValue('dataSourceName', null); // set data source name back to "null"
            prevExpressions.length > 0 && restoreExpressionsInQueries();
            prevCondition && setValue('condition', prevCondition);
            // @PERCONA
        }
        else if (typeInForm === RuleFormType.templated) {
            setValue('type', RuleFormType.templated);
        }
        else {
            setValue('type', RuleFormType.cloudAlerting);
            // dataSourceName is used only by Mimir/Loki alerting and recording rules
            // It should be empty for Grafana managed alert rules
            const newDsName = (_a = getDataSourceSrv().getInstanceSettings(queries[0].datasourceUid)) === null || _a === void 0 ? void 0 : _a.name;
            if (newDsName) {
                setValue('dataSourceName', newDsName);
            }
            updateExpressionAndDatasource(queries);
            const expressions = queries.filter((query) => query.datasourceUid === ExpressionDatasourceUID);
            setPrevExpressions(expressions);
            removeExpressionsInQueries();
            setPrevCondition(condition);
        }
    }, [
        getValues,
        setValue,
        prevExpressions.length,
        restoreExpressionsInQueries,
        prevCondition,
        updateExpressionAndDatasource,
        queries,
        removeExpressionsInQueries,
        condition,
    ]);
    return (React.createElement(RuleEditorSection, { stepNo: 2, title: type !== RuleFormType.cloudRecording ? 'Define query and alert condition' : 'Define query', description: React.createElement(Stack, { direction: "row", gap: 0.5, alignItems: "baseline" },
            React.createElement(Text, { variant: "bodySmall", color: "secondary" }, "Define queries and/or expressions and then choose one of them as the alert rule condition. This is the threshold that an alert rule must meet or exceed in order to fire."),
            React.createElement(NeedHelpInfo, { contentText: `An alert rule consists of one or more queries and expressions that select the data you want to measure.
          Define queries and/or expressions and then choose one of them as the alert rule condition. This is the threshold that an alert rule must meet or exceed in order to fire.
          For more information on queries and expressions, see Query and transform data.`, externalLink: `https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/`, linkText: `Read about query and condition`, title: "Define query and alert condition" })) },
        (type === RuleFormType.cloudRecording || type === RuleFormType.cloudAlerting) && (React.createElement(CloudDataSourceSelector, { onChangeCloudDatasource: onChangeCloudDatasource, disabled: editingExistingRule })),
        isRecordingRuleType && dataSourceName && (React.createElement(Field, { error: (_a = errors.expression) === null || _a === void 0 ? void 0 : _a.message, invalid: !!((_b = errors.expression) === null || _b === void 0 ? void 0 : _b.message) },
            React.createElement(RecordingRuleEditor, { dataSourceName: dataSourceName, queries: queries, runQueries: runQueriesPreview, onChangeQuery: onChangeRecordingRulesQueries, panelData: queryPreviewData }))),
        isCloudAlertRuleType && dataSourceName && (React.createElement(Stack, { direction: "column" },
            React.createElement(Field, { error: (_c = errors.expression) === null || _c === void 0 ? void 0 : _c.message, invalid: !!((_d = errors.expression) === null || _d === void 0 ? void 0 : _d.message) },
                React.createElement(InputControl, { name: "expression", render: (_a) => {
                        var _b = _a.field, { ref } = _b, field = __rest(_b, ["ref"]);
                        return (React.createElement(ExpressionEditor, Object.assign({}, field, { dataSourceName: dataSourceName, showPreviewAlertsButton: !isRecordingRuleType, onChange: onChangeExpression })));
                    }, control: control, rules: {
                        required: { value: true, message: 'A valid expression is required' },
                    } })),
            React.createElement(SmartAlertTypeDetector, { editingExistingRule: editingExistingRule, queries: queries, rulesSourcesWithRuler: rulesSourcesWithRuler, onClickSwitch: onClickSwitch }))),
        isGrafanaManagedType && (React.createElement(Stack, { direction: "column" },
            React.createElement(QueryEditor, { queries: dataQueries, expressions: expressionQueries, onRunQueries: runQueriesPreview, onChangeQueries: onChangeQueries, onDuplicateQuery: onDuplicateQuery, panelData: queryPreviewData, condition: condition, onSetCondition: handleSetCondition }),
            React.createElement(Tooltip, { content: 'You appear to have no compatible data sources', show: noCompatibleDataSources },
                React.createElement(Button, { type: "button", onClick: () => {
                        dispatch(addNewDataQuery());
                    }, variant: "secondary", "aria-label": selectors.components.QueryTab.addQuery, disabled: noCompatibleDataSources, className: styles.addQueryButton }, "Add query")),
            React.createElement(SmartAlertTypeDetector, { editingExistingRule: editingExistingRule, rulesSourcesWithRuler: rulesSourcesWithRuler, queries: queries, onClickSwitch: onClickSwitch }),
            React.createElement(Stack, { direction: "column", gap: 0 },
                React.createElement(Text, { element: "h5" }, "Expressions"),
                React.createElement(Text, { variant: "bodySmall", color: "secondary" }, "Manipulate data returned from queries with math and other operations.")),
            React.createElement(ExpressionsEditor, { queries: queries, panelData: queryPreviewData, condition: condition, onSetCondition: handleSetCondition, onRemoveExpression: (refId) => {
                    dispatch(removeExpression(refId));
                }, onUpdateRefId: onUpdateRefId, onUpdateExpressionType: (refId, type) => {
                    dispatch(updateExpressionType({ refId, type }));
                }, onUpdateQueryExpression: (model) => {
                    dispatch(updateExpression(model));
                } }),
            React.createElement(Stack, { direction: "row" },
                config.expressionsEnabled && React.createElement(TypeSelectorButton, { onClickType: onClickType }),
                isPreviewLoading && (React.createElement(Button, { icon: "fa fa-spinner", type: "button", variant: "destructive", onClick: cancelQueries }, "Cancel")),
                !isPreviewLoading && (React.createElement(Button, { icon: "sync", type: "button", onClick: runQueriesPreview, disabled: emptyQueries }, "Preview"))),
            emptyQueries && (React.createElement(Alert, { title: "No queries or expressions have been configured", severity: "warning" }, "Create at least one query or expression to be alerted on"))))));
};
function TypeSelectorButton({ onClickType }) {
    const newMenu = (React.createElement(Menu, null, expressionTypes.map((type) => {
        var _a, _b;
        return (React.createElement(Tooltip, { key: type.value, content: (_a = type.description) !== null && _a !== void 0 ? _a : '', placement: "right" },
            React.createElement(MenuItem, { key: type.value, onClick: () => { var _a; return onClickType((_a = type.value) !== null && _a !== void 0 ? _a : ExpressionQueryType.math); }, label: (_b = type.label) !== null && _b !== void 0 ? _b : '' })));
    })));
    return (React.createElement(Dropdown, { overlay: newMenu },
        React.createElement(Button, { variant: "secondary" },
            "Add expression",
            React.createElement(Icon, { name: "angle-down" }))));
}
const getStyles = (theme) => ({
    addQueryButton: css `
    width: fit-content;
  `,
    helpInfo: css `
    display: flex;
    flex-direction: row;
    align-items: center;
    width: fit-content;
    font-weight: ${theme.typography.fontWeightMedium};
    margin-left: ${theme.spacing(1)};
    font-size: ${theme.typography.size.sm};
    cursor: pointer;
  `,
    helpInfoText: css `
    margin-left: ${theme.spacing(0.5)};
    text-decoration: underline;
  `,
    infoLink: css `
    color: ${theme.colors.text.link};
  `,
});
const useSetExpressionAndDataSource = () => {
    const { setValue } = useFormContext();
    return (updatedQueries) => {
        // update data source name and expression if it's been changed in the queries from the reducer when prom or loki query
        const query = updatedQueries[0];
        if (!query) {
            return;
        }
        const dataSourceSettings = getDataSourceSrv().getInstanceSettings(query.datasourceUid);
        if (!dataSourceSettings) {
            throw new Error('The Data source has not been defined.');
        }
        if (isPromOrLokiQuery(query.model)) {
            const expression = query.model.expr;
            setValue('expression', expression);
        }
    };
};
//# sourceMappingURL=QueryAndExpressionsStep.js.map