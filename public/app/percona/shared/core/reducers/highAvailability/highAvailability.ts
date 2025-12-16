import { CancelToken } from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { HighAvailabilityState } from './highAvailability.types';

import { HighAvailabilityService } from 'app/percona/shared/services/highAvailability/HighAvailability.service';
import {
  HighAvailabilityNodesResponse,
  HighAvailabilityStatusResponse,
} from 'app/percona/shared/services/highAvailability/HighAvailability.types';

const initialState: HighAvailabilityState = {
  isLoading: false,
  isEnabled: false,
  nodes: [],
};

const highAvailabilitySlice = createSlice({
  name: 'highAvailability',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHighAvailabilityStatus.pending, (state) => ({
      ...state,
      isLoading: true,
    }));
    builder.addCase(fetchHighAvailabilityStatus.rejected, (state) => ({
      ...state,
      isEnabled: false,
      isLoading: false,
    }));
    builder.addCase(fetchHighAvailabilityStatus.fulfilled, (state, action) => ({
      ...state,
      isEnabled: action.payload.status === 'Enabled',
    }));
    builder.addCase(fetchHighAvailabilityNodes.fulfilled, (state, action) => ({
      ...state,
      nodes: action.payload.nodes,
    }));
  },
});

export const fetchHighAvailabilityStatus = createAsyncThunk<HighAvailabilityStatusResponse>(
  'percona/fetchHighAvailabilityStatus',
  async () => {
    return await HighAvailabilityService.getStatus();
  }
);

export const fetchHighAvailabilityNodes = createAsyncThunk<HighAvailabilityNodesResponse, { token?: CancelToken }>(
  'percona/fetchHighAvailabilityNodes',
  async (params = {}) => {
    return await HighAvailabilityService.getNodes(params.token);
  }
);

export default highAvailabilitySlice.reducer;
