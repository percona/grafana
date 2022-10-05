import { CancelToken } from 'axios';

import { ServiceListPayload, ServiceType } from 'app/percona/shared/services/services/Services.types';

export interface ServicesState {
  activeTypes: ServiceType[];
  services: ServiceListPayload;
  isLoading: boolean;
}

export interface ListServicesParams {
  nodeId: string;
  serviceType: ServiceType;
  externalGroup: string;
  token: CancelToken;
}

export interface RemoveServiceParams {
  serviceId: string;
  force: boolean;
}

export interface RemoveServicesParams {
  services: RemoveServiceParams[];
  cancelToken?: CancelToken;
}
