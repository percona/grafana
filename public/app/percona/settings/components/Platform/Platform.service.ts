import { api } from 'app/percona/shared/helpers/api';

import { ConnectRequest } from './types';

export const PlatformService = {
  connect(body: ConnectRequest): Promise<void> {
    return api.post<void, ConnectRequest>('/v1/Platform/Connect', body, true);
  },
  disconnect(): Promise<void> {
    return api.post<void, Object>('/v1/Platform/Disconnect', {});
  },
  forceDisconnect(): Promise<void> {
    return api.post<void, Object>('/v1/Platform/Disconnect', { force: true });
  },
  getServerInfo(): Promise<{ pmm_server_id: string; pmm_server_name: string }> {
    return api.post(`/v1/Platform/ServerInfo`, {}, true);
  },
};
