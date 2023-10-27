import { createSlice } from '@reduxjs/toolkit';

import { withAppEvents, withSerializedError } from 'app/features/alerting/unified/utils/redux';
import { PMMDumpService } from 'app/percona/pmm-dump/PMMDump.service';
import { PMMDumpServices, SendToSupportRequestBody, ExportDatasetService } from 'app/percona/pmm-dump/PmmDump.types';
import { PmmDumpState } from 'app/percona/shared/core/reducers/pmmDump/pmmDump.types';
import { mapDumps, mapExportData } from 'app/percona/shared/core/reducers/pmmDump/pmmDump.utils';
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

export const fetchPmmDumpAction = createAsyncThunk<PMMDumpServices[]>('percona/fetchDumps', async () => {
  return mapDumps(await PMMDumpService.list());
});

export const deletePmmDumpAction = createAsyncThunk(
  'percona/deletePmmDump',
  async (dumpIds: string[]): Promise<void> =>
    withAppEvents(
      (async () => {
        await PMMDumpService.delete(dumpIds);
      })(),
      {
        successMessage: 'Deleted successfully',
        errorMessage: 'Failed to delete ',
      }
    )
);

export const sendToSupportAction = createAsyncThunk(
  'percona/sendToSupport',
  async (body: SendToSupportRequestBody): Promise<void> =>
    withSerializedError(
      (async () => {
        await PMMDumpService.sendToSupport(body);
      })()
    )
);

export const triggerDumpAction = createAsyncThunk(
  'percona/triggerDump',
  async (body: ExportDatasetService): Promise<void> =>
    withSerializedError(
      (async () => {
        await PMMDumpService.trigger(mapExportData(body));
      })()
    )
);

export default pmmDumpSlice.reducer;
