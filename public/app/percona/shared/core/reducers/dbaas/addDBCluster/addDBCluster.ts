/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { withAppEvents } from '../../../../../../features/alerting/unified/utils/redux';
import { newDBClusterService } from '../../../../../dbaas/components/DBCluster/DBCluster.utils';
import { SETTINGS_TIMEOUT } from '../../../constants';
import { updateSettingsAction } from '../../index';

import { PerconaAddDBClusterState } from './addDBCluster.types';

export const initialAddDBClusterState: PerconaAddDBClusterState = {
  result: undefined,
  loading: undefined,
};

const perconaAddDBClusterSlice = createSlice({
  name: 'perconaAddDBCluster',
  initialState: initialAddDBClusterState,
  reducers: {
    resetAddDBClusterState: (state): PerconaAddDBClusterState => {
      return {
        ...state,
        result: undefined,
        loading: undefined,
      };
    },
    setAddDBClusterLoading: (state): PerconaAddDBClusterState => {
      return {
        ...state,
        loading: true,
      };
    },
    setAddDBClusterResult: (state, action): PerconaAddDBClusterState => {
      return {
        ...state,
        result: action.payload,
        loading: false,
      };
    },
  },
});

export const addDbClusterAction = createAsyncThunk(
  'percona/addDBCluster',
  async (args: { values: Record<string, any>; setPMMAddress?: boolean }, thunkAPI): Promise<void> => {
    const {
      name,
      kubernetesCluster,
      databaseType,
      databaseVersion,
      nodes,
      memory,
      cpu,
      disk,
      expose,
      internetFacing,
      sourceRanges,
      configuration,
      storageClass,
    } = args.values;

    const dbClusterService = newDBClusterService(databaseType.value);
    thunkAPI.dispatch(setAddDBClusterLoading());
    if (args.setPMMAddress) {
      await thunkAPI.dispatch(updateSettingsAction({ body: { pmm_public_address: window.location.host } }));
      await new Promise((resolve) => setTimeout(resolve, SETTINGS_TIMEOUT));
    }
    await withAppEvents(
      dbClusterService.addDBCluster({
        kubernetesClusterName: kubernetesCluster.value,
        clusterName: name,
        databaseType: databaseType.value,
        clusterSize: nodes,
        cpu,
        memory,
        disk,
        databaseImage: databaseVersion.value,
        expose,
        internetFacing,
        sourceRanges: sourceRanges.map((item: any) => item?.sourceRange || ''),
        configuration,
        ...(storageClass?.value && { storageClass: storageClass?.value }),
      }),
      {
        successMessage: 'Cluster was successfully added',
      }
    )
      .then(() => {
        thunkAPI.dispatch(setAddDBClusterResult('ok'));
      })
      .catch(() => {
        thunkAPI.dispatch(setAddDBClusterResult('error'));
      });
  }
);

export const { setAddDBClusterResult, setAddDBClusterLoading, resetAddDBClusterState } =
  perconaAddDBClusterSlice.actions;
export default perconaAddDBClusterSlice.reducer;
