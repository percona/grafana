import { CancelToken } from 'axios';
import { api } from 'app/percona/shared/helpers/api';

interface UserConnectedResponse {
  connected: boolean;
}

const BASE_URL = '/v1/Platform';

export const UserService = {
  async getConnectionStatus(cancelToken?: CancelToken): Promise<boolean> {
    const { connected }: UserConnectedResponse = await api.post(`${BASE_URL}/Status`, {}, false, cancelToken);
    return connected;
  },
};
