import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CancelToken } from 'axios';

import { withSerializedError } from '../../../../../../features/alerting/unified/utils/redux';
import { DBClusterService } from '../../../../../dbaas/components/DBCluster/DBCluster.service';
import { DBCluster, DBClusterListResponse } from '../../../../../dbaas/components/DBCluster/DBCluster.types';
import { Kubernetes } from '../../../../../dbaas/components/Kubernetes/Kubernetes.types';

import { PerconaDBClustersState } from './dbClusters.types';
import { formatDBClusters } from './dbClusters.utils';

export const initialDBClustersState: PerconaDBClustersState = {
  result: [],
  loading: undefined,
  credentialsLoading: undefined,
};

const perconaDBClustersSlice = createSlice({
  name: 'perconaDBClusters',
  initialState: initialDBClustersState,
  reducers: {
    resetDBClustersToInitial: (state): PerconaDBClustersState => ({
      ...state,
      result: [],
    }),
    setDBClusters: (state, action: PayloadAction<DBCluster[]>): PerconaDBClustersState => {
      return {
        ...state,
        result: action.payload,
        loading: false,
      };
    },
    setDBClustersLoading: (state): PerconaDBClustersState => {
      return {
        ...state,
        loading: true,
      };
    },
  },
});

export const fetchDBClustersAction = createAsyncThunk(
  'percona/fetchDBClusters',
  (args: { kubernetes: Kubernetes[]; tokens: CancelToken[] }, thunkAPI): Promise<void> =>
    withSerializedError(
      (async () => {
        thunkAPI.dispatch(setDBClustersLoading());
        const requests = args.kubernetes.map((k, idx) => DBClusterService.getDBClusters(k, args.tokens[idx]));
        const promises = await Promise.allSettled(requests);

        const dbClustersListResponse = promises.reduce<DBClusterListResponse[]>((filtered, promise) => {
          if (promise.status === 'fulfilled') {
            filtered.push(promise?.value);
          }
          return filtered;
        }, []);
        const dbClusters = formatDBClusters(dbClustersListResponse, args.kubernetes);
        thunkAPI.dispatch(setDBClusters(dbClusters));
      })()
    )
);

export const { setDBClusters, setDBClustersLoading } = perconaDBClustersSlice.actions;
export default perconaDBClustersSlice.reducer;
