import React from 'react';
import { LokiQueryField } from './LokiQueryField';
export function LokiQueryEditorForAlerting(props) {
    const { query, data, datasource, onChange, onRunQuery, history } = props;
    return (React.createElement(LokiQueryField, { datasource: datasource, query: query, onChange: onChange, onRunQuery: onRunQuery, history: history, data: data, placeholder: "Enter a Loki query", "data-testid": testIds.editor }));
}
export const testIds = {
    editor: 'loki-editor-cloud-alerting',
};
//# sourceMappingURL=LokiQueryEditorForAlerting.js.map