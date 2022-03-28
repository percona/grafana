import { CancelToken } from 'axios';
import { api } from 'app/percona/shared/helpers/api';
import { UserConnectedResponse } from './User.types';

const BASE_URL = '/v1/Platform';

export const UserService = {
  async getConnectionStatus(cancelToken?: CancelToken, disableNotifications = false): Promise<boolean> {
    const { connected }: UserConnectedResponse = await api.post(
      `${BASE_URL}/Status`,
      {},
      disableNotifications,
      cancelToken
    );
    return connected;
  },
};
