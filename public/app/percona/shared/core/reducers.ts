import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CancelToken } from 'axios';
import { createAsyncSlice, withAppEvents } from 'app/features/alerting/unified/utils/redux';
import { KubernetesService } from 'app/percona/dbaas/components/Kubernetes/Kubernetes.service';
import {
  CheckOperatorUpdateAPI,
  ComponentToUpdate,
  Kubernetes,
  KubernetesAPI,
  KubernetesListAPI,
  NewKubernetesCluster,
  Operator,
  OperatorsList,
} from 'app/percona/dbaas/components/Kubernetes/Kubernetes.types';
import { Settings } from 'app/percona/settings/Settings.types';
import { KubernetesClusterStatus } from 'app/percona/dbaas/components/Kubernetes/KubernetesClusterStatus/KubernetesClusterStatus.types';
import { OPERATOR_COMPONENT_TO_UPDATE_MAP } from 'app/percona/dbaas/components/Kubernetes/Kubernetes.constants';

export interface PerconaSettingsState extends Settings {
  isLoading: boolean;
}

export const initialSettingsState: PerconaSettingsState = {
  updatesDisabled: true,
  telemetryEnabled: false,
  backupEnabled: false,
  dbaasEnabled: false,
  metricsResolutions: {
    lr: '10s',
    hr: '15s',
    mr: '20s',
  },
  dataRetention: '',
  sshKey: '',
  awsPartitions: [],
  alertManagerUrl: '',
  alertManagerRules: '',
  sttEnabled: false,
  alertingEnabled: false,
  alertingSettings: {
    email: {
      from: '',
      smarthost: '',
      hello: '',
      require_tls: false,
    },
    slack: {
      url: '',
    },
  },
  sttCheckIntervals: {
    rareInterval: '10s',
    standardInterval: '10s',
    frequentInterval: '10s',
  },
  isLoading: true,
};

const perconaSettingsSlice = createSlice({
  name: 'perconaSettings',
  initialState: initialSettingsState,
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<PerconaSettingsState>>): PerconaSettingsState => ({
      ...state,
      ...action.payload,
      isLoading: false,
    }),
    setSettingsLoading: (state, action: PayloadAction<boolean>): PerconaSettingsState => ({
      ...state,
      isLoading: action.payload,
    }),
  },
});

export const { setSettings, setSettingsLoading } = perconaSettingsSlice.actions;

export const perconaSettingsReducers = perconaSettingsSlice.reducer;

export interface PerconaUserState {
  isAuthorized: boolean;
}

export const initialUserState: PerconaUserState = {
  isAuthorized: false,
};

const perconaUserSlice = createSlice({
  name: 'perconaUser',
  initialState: initialUserState,
  reducers: {
    setAuthorized: (state, action: PayloadAction<boolean>): PerconaUserState => ({
      ...state,
      isAuthorized: action.payload,
    }),
  },
});

export const { setAuthorized } = perconaUserSlice.actions;

export const perconaUserReducers = perconaUserSlice.reducer;

const toKubernetesListModel = (
  response: KubernetesListAPI,
  checkUpdateResponse: CheckOperatorUpdateAPI
): Kubernetes[] => (response.kubernetes_clusters ?? []).map(toKubernetesModel(checkUpdateResponse));

const toKubernetesModel = (checkUpdateResponse: CheckOperatorUpdateAPI) => ({
  kubernetes_cluster_name: kubernetesClusterName,
  operators,
  status,
}: KubernetesAPI): Kubernetes => ({
  kubernetesClusterName,
  operators: toModelOperators(kubernetesClusterName, operators, checkUpdateResponse),
  status: status as KubernetesClusterStatus,
});

const toModelOperators = (
  kubernetesClusterName: string,
  operators: OperatorsList,
  { cluster_to_components }: CheckOperatorUpdateAPI
): OperatorsList => {
  const modelOperators = {} as OperatorsList;
  const componentToUpdate = cluster_to_components[kubernetesClusterName].component_to_update_information;

  Object.entries(operators).forEach(([operatorKey, operator]: [string, Operator]) => {
    const component = OPERATOR_COMPONENT_TO_UPDATE_MAP[operatorKey as keyof OperatorsList];

    modelOperators[operatorKey as keyof OperatorsList] = {
      availableVersion:
        componentToUpdate && componentToUpdate[component] ? componentToUpdate[component].available_version : undefined,
      ...operator,
    };
  });

  return modelOperators;
};

export const fetchKubernetesAction = createAsyncThunk(
  'percona/fetchKubernetes',
  async (tokens?: { kubernetes?: CancelToken; operator?: CancelToken }): Promise<Kubernetes[]> => {
    const [results, checkUpdateResults] = await Promise.all([
      KubernetesService.getKubernetes(tokens?.kubernetes),
      KubernetesService.checkForOperatorUpdate(tokens?.operator),
    ]);

    return toKubernetesListModel(results, checkUpdateResults);
  }
);

export const deleteKubernetesAction = createAsyncThunk(
  'percona/deleteKubernetes',
  async (args: { kubernetesToDelete: Kubernetes; force?: boolean }, thunkAPI): Promise<void> => {
    await withAppEvents(KubernetesService.deleteKubernetes(args.kubernetesToDelete, args.force), {
      successMessage: 'Cluster successfully unregistered',
    });
    await thunkAPI.dispatch(fetchKubernetesAction());
  }
);

export const addKubernetesAction = createAsyncThunk(
  'percona/addKubernetes',
  async (args: { kubernetesToAdd: NewKubernetesCluster; token?: CancelToken }, thunkAPI): Promise<void> => {
    await withAppEvents(KubernetesService.addKubernetes(args.kubernetesToAdd, args.token), {
      successMessage: 'Cluster was successfully registered',
    });
    await thunkAPI.dispatch(fetchKubernetesAction());
  }
);

export const instalKuberneteslOperatorAction = createAsyncThunk(
  'percona/instalKuberneteslOperator',
  async (
    args: { kubernetesClusterName: string; operatorType: ComponentToUpdate; availableVersion: string },
    thunkAPI
  ): Promise<void> => {
    await KubernetesService.installOperator(args.kubernetesClusterName, args.operatorType, args.availableVersion);
    await thunkAPI.dispatch(fetchKubernetesAction());
  }
);

const kubernetesReducer = createAsyncSlice('kubernetes', fetchKubernetesAction).reducer;
const deleteKubernetesReducer = createAsyncSlice('deleteKubernetes', deleteKubernetesAction).reducer;
const addKubernetesReducer = createAsyncSlice('addKubernetes', addKubernetesAction).reducer;
const installKubernetesOperatorReducer = createAsyncSlice('instalKuberneteslOperator', instalKuberneteslOperatorAction)
  .reducer;

export default {
  perconaSettings: perconaSettingsReducers,
  perconaUser: perconaUserReducers,
  perconaKubernetes: kubernetesReducer,
  deletePerconaKubernetes: deleteKubernetesReducer,
  addPerconaKubernetes: addKubernetesReducer,
  installPerconaKubernetesOperator: installKubernetesOperatorReducer,
};
