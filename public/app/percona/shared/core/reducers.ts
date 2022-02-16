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
    setFeature: (state, action: PayloadAction<Partial<FeatureFlags>>): PerconaFeaturesState => {
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

export const { setFeature } = perconaFeaturesSlice.actions;

export const perconaFeaturesReducers = perconaFeaturesSlice.reducer;

export default {
  perconaPortal: perconaPortalReducers,
  perconaFeatures: perconaFeaturesReducers,
};
