import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Settings } from 'app/percona/settings/Settings.types';

export const initialSettingsState: Settings = {
  updatesDisabled: true,
  telemetryEnabled: false,
  backupEnabled: false,
  dbaasEnabled: false,
  metricsResolutions: {
    lr: '10s',
    hr: '15s',
    mr: '20s',
  },
  dataRetention: '',
  sshKey: '',
  awsPartitions: [],
  alertManagerUrl: '',
  alertManagerRules: '',
  sttEnabled: false,
  alertingEnabled: false,
  alertingSettings: {
    email: {
      from: '',
      smarthost: '',
      hello: '',
      require_tls: false,
    },
    slack: {
      url: '',
    },
  },
  sttCheckIntervals: {
    rareInterval: '10s',
    standardInterval: '10s',
    frequentInterval: '10s',
  },
};

const perconaSettingsSlice = createSlice({
  name: 'perconaSettings',
  initialState: initialSettingsState,
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<Settings>>): Settings => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { setSettings } = perconaSettingsSlice.actions;

export const perconaSettingsReducers = perconaSettingsSlice.reducer;

export interface PerconaUserState {
  isAuthorized: boolean;
}

export const initialUserState: PerconaUserState = {
  isAuthorized: false,
};

const perconaUserSlice = createSlice({
  name: 'perconaUser',
  initialState: initialUserState,
  reducers: {
    setAuthorized: (state, action: PayloadAction<boolean>): PerconaUserState => ({
      ...state,
      isAuthorized: action.payload,
    }),
  },
});

export const { setAuthorized } = perconaUserSlice.actions;

export const perconaUserReducers = perconaUserSlice.reducer;

export default {
  perconaSettings: perconaSettingsReducers,
  perconaUser: perconaUserReducers,
};
