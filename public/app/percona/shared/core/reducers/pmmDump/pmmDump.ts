import { createSlice } from '@reduxjs/toolkit';

import { withAppEvents, withSerializedError } from 'app/features/alerting/unified/utils/redux';
import { PMMDumpService } from 'app/percona/pmm-dump/PMMDump.service';
import {
  PMMDumpServices,
  SendToSupportRequestBody,
  ExportDatasetService,
  DumpLogs,
} from 'app/percona/pmm-dump/PmmDump.types';
import { PmmDumpState, LogsActionProps } from 'app/percona/shared/core/reducers/pmmDump/pmmDump.types';
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
    }));

    builder.addCase(fetchPmmDumpAction.fulfilled, (state, action) => ({
      ...state,
      dumps: action.payload,
    }));
    builder.addCase(sendToSupportAction.pending, (state, action) => ({
      ...state,
      isLoading: true,
    }));
    builder.addCase(sendToSupportAction.fulfilled, (state, action) => ({
      ...state,
      isLoading: false,
    }));
    builder.addCase(sendToSupportAction.rejected, (state) => ({
      ...state,
      isLoading: false,
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
    withAppEvents(
      (async () => {
        await PMMDumpService.sendToSupport(body);
      })(),
      {
        successMessage: 'The message was send successfully!',
      }
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

export const getDumpLogsAction = createAsyncThunk(
  'percona/getDumpLogs',
  async (body: LogsActionProps): Promise<DumpLogs> =>
    withSerializedError(
      (async () => {
        let logs = await PMMDumpService.getLogs(body.artifactId, body.startingChunk, body.offset, body.token);
        return logs;
      })()
    )
);

export default pmmDumpSlice.reducer;
