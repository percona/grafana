import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ServicesService } from 'app/percona/shared/services/services/Services.service';
import { ServiceListPayload } from 'app/percona/shared/services/services/Services.types';
import { createAsyncThunk } from 'app/types';

import { filterFulfilled, processPromiseResults } from '../../../helpers/promises';

import { RemoveServicesParams, ListServicesParams, ServicesState } from './services.types';
import { toRemoveServiceBody, toListServicesBody } from './services.utils';

const initialState: ServicesState = {
  services: {},
  isLoading: false,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<ServiceListPayload>): ServicesState => ({
      ...state,
      services: action.payload,
    }),
    setLoading: (state, action: PayloadAction<boolean>): ServicesState => ({
      ...state,
      isLoading: action.payload,
    }),
  },
});

export const { setServices, setLoading } = servicesSlice.actions;

export const fetchServicesAction = createAsyncThunk(
  'percona/fetchServices',
  async (params: Partial<ListServicesParams> = {}, thunkAPI): Promise<void> => {
    thunkAPI.dispatch(setLoading(true));
    const body = toListServicesBody(params);
    const response = await ServicesService.getServices(body, params.token);
    thunkAPI.dispatch(setServices(response));
    thunkAPI.dispatch(setLoading(false));
  }
);

export const removeServicesAction = createAsyncThunk(
  'percona/removeServices',
  async (params: RemoveServicesParams): Promise<number> => {
    const bodies = params.services.map(toRemoveServiceBody);
    const requests = bodies.map((body) => ServicesService.removeService(body, params.cancelToken));
    const results = await processPromiseResults(requests);
    const successfullyDeletedCount = results.filter(filterFulfilled).length;
    return successfullyDeletedCount;
  }
);

export default servicesSlice.reducer;
