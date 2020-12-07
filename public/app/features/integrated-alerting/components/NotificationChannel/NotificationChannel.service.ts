import { getBackendSrv } from '@grafana/runtime';
import { NotificationChannel, NotificationChannelListResponse } from './NotificationChannel.types';
import { TO_MODEL, getType } from './NotificationChannel.utils';

const BASE_URL = `${window.location.origin}/v1/management/ia/Channels`;

export const NotificationChannelService = {
  async list(): Promise<NotificationChannel[]> {
    return getBackendSrv()
      .post(`${BASE_URL}/List`)
      .then(({ channels }: NotificationChannelListResponse) =>
        channels.map(channel => TO_MODEL[getType(channel)](channel))
      );
  },
};
