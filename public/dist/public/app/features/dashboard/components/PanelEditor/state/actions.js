import { __awaiter } from "tslib";
import { pick } from 'lodash';
import store from 'app/core/store';
import { removePanel } from 'app/features/dashboard/utils/panel';
import { cleanUpPanelState } from 'app/features/panel/state/actions';
import { panelModelAndPluginReady } from 'app/features/panel/state/reducers';
import { closeEditor, PANEL_EDITOR_UI_STATE_STORAGE_KEY, setDiscardChanges, setPanelEditorUIState, updateEditorInitState, } from './reducers';
export function initPanelEditor(sourcePanel, dashboard) {
    return (dispatch) => __awaiter(this, void 0, void 0, function* () {
        const panel = dashboard.initEditPanel(sourcePanel);
        dispatch(updateEditorInitState({
            panel,
            sourcePanel,
        }));
    });
}
export function discardPanelChanges() {
    return (dispatch, getStore) => __awaiter(this, void 0, void 0, function* () {
        const { getPanel } = getStore().panelEditor;
        getPanel().configRev = 0;
        dispatch(setDiscardChanges(true));
    });
}
export function updateDuplicateLibraryPanels(modifiedPanel, dashboard) {
    return (dispatch) => {
        var _a, _b, _c;
        if (((_a = modifiedPanel.libraryPanel) === null || _a === void 0 ? void 0 : _a.uid) === undefined || !dashboard) {
            return;
        }
        const modifiedSaveModel = modifiedPanel.getSaveModel();
        for (const panel of dashboard.panels) {
            if (skipPanelUpdate(modifiedPanel, panel)) {
                continue;
            }
            panel.restoreModel(Object.assign(Object.assign({}, modifiedSaveModel), pick(panel, 'gridPos', 'id')));
            // Loaded plugin is not included in the persisted properties
            // So is not handled by restoreModel
            const pluginChanged = ((_b = panel.plugin) === null || _b === void 0 ? void 0 : _b.meta.id) !== ((_c = modifiedPanel.plugin) === null || _c === void 0 ? void 0 : _c.meta.id);
            panel.plugin = modifiedPanel.plugin;
            panel.configRev++;
            if (pluginChanged) {
                panel.generateNewKey();
                dispatch(panelModelAndPluginReady({ key: panel.key, plugin: panel.plugin }));
            }
            // Resend last query result on source panel query runner
            // But do this after the panel edit editor exit process has completed
            setTimeout(() => {
                panel.getQueryRunner().useLastResultFrom(modifiedPanel.getQueryRunner());
            }, 20);
        }
        if (modifiedPanel.repeat) {
            // We skip any repeated library panels so we need to update them by calling processRepeats
            // But do this after the panel edit editor exit process has completed
            setTimeout(() => dashboard.processRepeats(), 20);
        }
    };
}
export function skipPanelUpdate(modifiedPanel, panelToUpdate) {
    var _a;
    // don't update library panels that aren't of the same type
    if (((_a = panelToUpdate.libraryPanel) === null || _a === void 0 ? void 0 : _a.uid) !== modifiedPanel.libraryPanel.uid) {
        return true;
    }
    // don't update the modifiedPanel twice
    if (panelToUpdate.id && panelToUpdate.id === modifiedPanel.id) {
        return true;
    }
    // don't update library panels that are repeated
    if (panelToUpdate.repeatPanelId) {
        return true;
    }
    return false;
}
export function exitPanelEditor() {
    return (dispatch, getStore) => __awaiter(this, void 0, void 0, function* () {
        const dashboard = getStore().dashboard.getModel();
        const { getPanel, getSourcePanel, shouldDiscardChanges } = getStore().panelEditor;
        const panel = getPanel();
        if (dashboard) {
            dashboard.exitPanelEditor();
        }
        const sourcePanel = getSourcePanel();
        if (hasPanelChangedInPanelEdit(panel) && !shouldDiscardChanges) {
            const modifiedSaveModel = panel.getSaveModel();
            const panelTypeChanged = sourcePanel.type !== panel.type;
            dispatch(updateDuplicateLibraryPanels(panel, dashboard));
            sourcePanel.restoreModel(modifiedSaveModel);
            sourcePanel.configRev++; // force check the configs
            if (panelTypeChanged) {
                // Loaded plugin is not included in the persisted properties so is not handled by restoreModel
                sourcePanel.plugin = panel.plugin;
                sourcePanel.generateNewKey();
                yield dispatch(panelModelAndPluginReady({ key: sourcePanel.key, plugin: panel.plugin }));
            }
            // Resend last query result on source panel query runner
            // But do this after the panel edit editor exit process has completed
            setTimeout(() => {
                sourcePanel.getQueryRunner().useLastResultFrom(panel.getQueryRunner());
                sourcePanel.render();
                // If all changes where saved then reset configRev after applying changes
                if (panel.hasSavedPanelEditChange && !panel.hasChanged) {
                    sourcePanel.configRev = 0;
                }
            }, 20);
        }
        // A new panel is only new until the first time we exit the panel editor
        if (sourcePanel.isNew) {
            if (!shouldDiscardChanges) {
                delete sourcePanel.isNew;
            }
            else {
                dashboard && removePanel(dashboard, sourcePanel, true);
            }
        }
        dispatch(cleanUpPanelState(panel.key));
        dispatch(closeEditor());
    });
}
function hasPanelChangedInPanelEdit(panel) {
    return panel.hasChanged || panel.hasSavedPanelEditChange || panel.isAngularPlugin();
}
export function updatePanelEditorUIState(uiState) {
    return (dispatch, getStore) => {
        const nextState = Object.assign(Object.assign({}, getStore().panelEditor.ui), uiState);
        dispatch(setPanelEditorUIState(nextState));
        try {
            store.setObject(PANEL_EDITOR_UI_STATE_STORAGE_KEY, nextState);
        }
        catch (error) {
            console.error(error);
        }
    };
}
//# sourceMappingURL=actions.js.map