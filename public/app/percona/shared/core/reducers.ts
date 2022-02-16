import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureFlags } from 'app/percona/shared/core/types';

export interface PerconaPortalState {
  connected: boolean;
}

export const initialPortalState: PerconaPortalState = { connected: false };

const perconaPortalSlice = createSlice({
  name: 'perconaPortal',
  initialState: initialPortalState,
  reducers: {
    setPortalConnected: (state, action: PayloadAction<boolean>): PerconaPortalState => ({
      ...state,
      connected: action.payload,
    }),
  },
});

export const { setPortalConnected } = perconaPortalSlice.actions;

export const perconaPortalReducers = perconaPortalSlice.reducer;

export type PerconaFeaturesState = FeatureFlags;

export const initialFeaturesState: PerconaFeaturesState = {
  sttEnabled: false,
  dbaasEnabled: false,
  backupEnabled: false,
  alertingEnabled: false,
};

const perconaFeaturesSlice = createSlice({
  name: 'perconaFeatures',
  initialState: initialFeaturesState,
  reducers: {
    setFeatures: (state, action: PayloadAction<Partial<FeatureFlags>>): PerconaFeaturesState => {
      const featuresSet: Partial<FeatureFlags> = {};
      Object.keys(action.payload).forEach((feature) => {
        const typedFeature = feature as keyof FeatureFlags;
        featuresSet[typedFeature] = action.payload[typedFeature];
      });

      return {
        ...state,
        ...featuresSet,
      };
    },
  },
});

export const { setFeatures } = perconaFeaturesSlice.actions;

export const perconaFeaturesReducers = perconaFeaturesSlice.reducer;

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
  perconaPortal: perconaPortalReducers,
  perconaFeatures: perconaFeaturesReducers,
  perconaUser: perconaUserReducers,
};
