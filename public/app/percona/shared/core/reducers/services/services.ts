import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ServiceAgentStatus } from 'app/percona/inventory/Inventory.types';
import { ServicesService } from 'app/percona/shared/services/services/Services.service';
import { Service, ServiceType } from 'app/percona/shared/services/services/Services.types';
import { createAsyncThunk } from 'app/types';

import { filterFulfilled, processPromiseResults } from '../../../helpers/promises';

import { ListServicesParams, RemoveServicesParams, ServicesState } from './services.types';
import { toDbServicesModel, toListServicesBody, toRemoveServiceBody } from './services.utils';

const initialState: ServicesState = {
  activeTypes: [],
  services: [],
  isLoading: false,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<Service[]>): ServicesState => ({
      ...state,
      services: action.payload,
    }),
    setLoading: (state, action: PayloadAction<boolean>): ServicesState => ({
      ...state,
      isLoading: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchServicesAction.pending, (state) => ({
      ...state,
      isLoading: true,
    }));
    builder.addCase(fetchServicesAction.rejected, (state) => ({
      ...state,
      isLoading: false,
    }));
    builder.addCase(fetchServicesAction.fulfilled, (state, action) => ({
      ...state,
      services: action.payload,
      isLoading: false,
    }));
    builder.addCase(fetchActiveServiceTypesAction.fulfilled, (state, action) => ({
      ...state,
      activeTypes: action.payload,
    }));
  },
});

export const { setServices, setLoading } = servicesSlice.actions;

export const fetchActiveServiceTypesAction = createAsyncThunk<ServiceType[]>(
  'percona/fetchActiveServiceTypes',
  async () => {
    const response = await ServicesService.getActive();
    return response.service_types || [];
  }
);

export const fetchServicesAction = createAsyncThunk<Service[], Partial<ListServicesParams>>(
  'percona/fetchServices',
  async (params = {}) => {
    const body = toListServicesBody(params);
    const services = await ServicesService.getServices(body, params.token);

    services.mariadb = [
      {
        service_id: '/service_id/72640c2f-d009-4f4c-ba44-7791cc809090',
        service_name: 'Maria 1',
        address: 'localhost',
        port: '90',
        node_id: 'node_1',
        node_name: 'node_one',
        socket: '',
        agents: [
          {
            agent_id: 'agent_1',
            status: ServiceAgentStatus.RUNNING,
          },
          {
            agent_id: 'agent_2',
            status: ServiceAgentStatus.RUNNING,
          },
        ],
      },
      {
        service_id: '/service_id/72640c2f-d009-4f4c-ba44-7791cc809090',
        service_name: 'Maria 2',
        address: 'localhost',
        port: '90',
        node_id: 'node_2',
        node_name: 'node_two',
        socket: 'my-socket',
        agents: [
          {
            agent_id: 'agent_1',
            status: ServiceAgentStatus.UNKNOWN,
          },
          {
            agent_id: 'agent_2',
            status: ServiceAgentStatus.STOPPING,
          },
        ],
      },
    ];

    return toDbServicesModel(services);
  }
);

export const removeServicesAction = createAsyncThunk(
  'percona/removeServices',
  async (params: RemoveServicesParams): Promise<number> => {
    const bodies = params.services.map(toRemoveServiceBody);
    const requests = bodies.map((body) => ServicesService.removeService(body, params.cancelToken));
    const results = await processPromiseResults(requests);
    return results.filter(filterFulfilled).length;
  }
);

export default servicesSlice.reducer;
