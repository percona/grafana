import { createSlice } from '@reduxjs/toolkit';

import { withSerializedError } from 'app/features/alerting/unified/utils/redux';
import { SendToSupportForm } from 'app/percona/pmm-dump/PmmDump.types';
import { PmmDumpState } from 'app/percona/shared/core/reducers/pmmDump/pmmDump.types';
import PmmDumpService from 'app/percona/shared/services/pmmDump/PmmDump.service';
import { PmmDump } from 'app/percona/shared/services/pmmDump/pmmDump.types';
import { createAsyncThunk } from 'app/types';

const initialState: PmmDumpState = {
  isLoading: false,
  dumps: [],
};

export const pmmDumpSlice = createSlice({
  name: 'pmmDumps',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPmmDumpAction.pending, (state) => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(fetchPmmDumpAction.fulfilled, (state, action) => ({
      ...state,
      isLoading: false,
      dumps: action.payload,
    }));
  },
});

export const fetchPmmDumpAction = createAsyncThunk<PmmDump[]>('percona/fetchDumps', () => {
  return withSerializedError(PmmDumpService.list());
});

export const deletePmmDumpAction = createAsyncThunk(
  'percona/deletePmmDump',
  async (dumpIds: string[]): Promise<void> =>
    withSerializedError(
      (async () => {
        await PmmDumpService.delete(dumpIds);
      })()
    )
);

export const sendToSupportAction = createAsyncThunk(
  'percona/sendToSupport',
  async (body: SendToSupportForm): Promise<void> =>
    withSerializedError(
      (async () => {
        await PmmDumpService.sendToSupport(body);
      })()
    )
);

export default pmmDumpSlice.reducer;
