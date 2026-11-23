import { Settings } from 'app/percona/settings/Settings.types';
import { StoreState } from 'app/types/store';

export const getPerconaSettings = (state: StoreState) => state.percona.settings;
export const getPerconaSettingFlag = (setting: keyof Settings) => (state: StoreState) =>
  !!state.percona.settings.result?.[setting];
export const getPerconaUser = (state: StoreState) => state.percona.user;
export const getTemplates = (state: StoreState) => state.percona.templates;
export const getServices = (state: StoreState) => state.percona.services;
export const getNodes = (state: StoreState) => state.percona.nodes;
export const getBackupLocations = (state: StoreState) => state.percona.backupLocations;
export const getAccessRoles = (state: StoreState) => state.percona.roles;
export const getUsers = (state: StoreState) => state.users;
export const getUsersInfo = (state: StoreState) => state.percona.users;
export const getDefaultRole = (state: StoreState) =>
  state.percona.roles.roles.find((r) => r.roleId === state.percona.settings.result?.defaultRoleId);
export const getDumps = (state: StoreState) => state.percona.pmmDumps;
export const getUpdatesInfo = (state: StoreState) => state.percona.updates;
export const getHighAvailability = (state: StoreState) => state.percona.highAvailability;
