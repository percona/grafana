import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { UpdatesService } from 'app/percona/shared/services/updates';

import { CheckUpdatesPayload, UpdatesState } from './updates.types';
import { mapUpdatesChangeLogs, responseToPayload } from './updates.utils';

const initialState: UpdatesState = {
  isLoading: false,
};

export const updatesSlice = createSlice({
  name: 'updates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(checkUpdatesAction.pending, (state) => ({
      ...initialState,
      isLoading: true,
    }));
    builder.addCase(checkUpdatesAction.fulfilled, (state, { payload }) => ({
      ...state,
      ...payload,
      isLoading: false,
    }));
    builder.addCase(checkUpdatesAction.rejected, (state) => ({
      ...state,
      isLoading: false,
    }));
    builder.addCase(checkUpdatesChangeLogs.pending, (state) => ({
      ...state,
    }));
    builder.addCase(checkUpdatesChangeLogs.fulfilled, (state, { payload }) => ({
      ...state,
      changeLogs: payload,
    }));
    builder.addCase(checkUpdatesChangeLogs.rejected, (state) => ({
      ...state,
    }));
  },
});

export const checkUpdatesAction = createAsyncThunk('percona/checkUpdates', async (): Promise<CheckUpdatesPayload> => {
  try {
    const res = await UpdatesService.getCurrentVersion({ force: true });
    return responseToPayload(res);
  } catch (error) {
    const res = await UpdatesService.getCurrentVersion({ force: true, only_installed_version: true });
    return responseToPayload(res);
  }
});

export const checkUpdatesChangeLogs = createAsyncThunk('percona/checkUpdatesChangelogs', async () => {
  return mapUpdatesChangeLogs(await UpdatesService.getUpdatesChangelogs());
});

export default updatesSlice.reducer;
