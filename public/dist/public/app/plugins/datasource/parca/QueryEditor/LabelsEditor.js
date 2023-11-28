import { __awaiter } from "tslib";
import { css } from '@emotion/css';
import React, { useEffect, useRef } from 'react';
import { useLatest } from 'react-use';
import { CodeEditor, useStyles2 } from '@grafana/ui';
import { languageDefinition } from '../lang';
import { CompletionProvider } from './autocomplete';
export function LabelsEditor(props) {
    const setupAutocompleteFn = useAutocomplete(props.datasource);
    const styles = useStyles2(getStyles);
    const onRunQueryRef = useLatest(props.onRunQuery);
    const containerRef = useRef(null);
    return (React.createElement("div", { className: styles.wrapper, 
        // NOTE: we will be setting inline-style-width/height on this element
        ref: containerRef },
        React.createElement(CodeEditor, { value: props.value, language: langId, onBlur: props.onChange, containerStyles: styles.queryField, monacoOptions: {
                folding: false,
                fontSize: 14,
                lineNumbers: 'off',
                overviewRulerLanes: 0,
                renderLineHighlight: 'none',
                scrollbar: {
                    vertical: 'hidden',
                    verticalScrollbarSize: 8,
                    horizontal: 'hidden',
                    horizontalScrollbarSize: 0,
                },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: {
                    top: 5,
                    bottom: 6,
                },
            }, onBeforeEditorMount: ensureParcaQL, onEditorDidMount: (editor, monaco) => {
                setupAutocompleteFn(editor, monaco);
                const updateElementHeight = () => {
                    const containerDiv = containerRef.current;
                    if (containerDiv !== null) {
                        const pixelHeight = editor.getContentHeight();
                        containerDiv.style.height = `${pixelHeight + EDITOR_HEIGHT_OFFSET}px`;
                        containerDiv.style.width = '100%';
                        const pixelWidth = containerDiv.clientWidth;
                        editor.layout({ width: pixelWidth, height: pixelHeight });
                    }
                };
                editor.onDidContentSizeChange(updateElementHeight);
                updateElementHeight();
                editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
                    onRunQueryRef.current(editor.getValue());
                });
            } })));
}
// this number was chosen by testing various values. it might be necessary
// because of the width of the border, not sure.
//it needs to do 2 things:
// 1. when the editor is single-line, it should make the editor height be visually correct
// 2. when the editor is multi-line, the editor should not be "scrollable" (meaning,
//    you do a scroll-movement in the editor, and it will scroll the content by a couple pixels
//    up & down. this we want to avoid)
const EDITOR_HEIGHT_OFFSET = 2;
/**
 * Hook that returns function that will set up monaco autocomplete for the label selector
 * @param datasource
 */
function useAutocomplete(datasource) {
    const autocompleteDisposeFun = useRef(null);
    useEffect(() => {
        // when we unmount, we unregister the autocomplete-function, if it was registered
        return () => {
            var _a;
            (_a = autocompleteDisposeFun.current) === null || _a === void 0 ? void 0 : _a.call(autocompleteDisposeFun);
        };
    }, []);
    // This should be run in monaco onEditorDidMount
    return (editor, monaco) => __awaiter(this, void 0, void 0, function* () {
        const provider = new CompletionProvider(datasource, monaco, editor);
        yield provider.init();
        const { dispose } = monaco.languages.registerCompletionItemProvider(langId, provider);
        autocompleteDisposeFun.current = dispose;
    });
}
// we must only run the setup code once
let parcaqlSetupDone = false;
const langId = 'parca';
function ensureParcaQL(monaco) {
    if (parcaqlSetupDone === false) {
        parcaqlSetupDone = true;
        const { aliases, extensions, mimetypes, def } = languageDefinition;
        monaco.languages.register({ id: langId, aliases, extensions, mimetypes });
        monaco.languages.setMonarchTokensProvider(langId, def.language);
        monaco.languages.setLanguageConfiguration(langId, def.languageConfiguration);
    }
}
const getStyles = () => {
    return {
        queryField: css `
      flex: 1;
      // Not exactly sure but without this the editor doe not shrink after resizing (so you can make it bigger but not
      // smaller). At the same time this does not actually make the editor 100px because it has flex 1 so I assume
      // this should sort of act as a flex-basis (but flex-basis does not work for this). So yeah CSS magic.
      width: 100px;
    `,
        wrapper: css `
      display: flex;
      flex: 1;
      border: 1px solid rgba(36, 41, 46, 0.3);
      border-radius: 2px;
    `,
    };
};
//# sourceMappingURL=LabelsEditor.js.map