import { NotificationChannelService } from './NotificationChannel.service';
import { notificationChannelResponseStubs, notificationChannelStubs } from './__mocks__/notificationChannelStubs';

const postMock = jest.fn();

jest.mock('@grafana/runtime', () => ({
  getBackendSrv: () => ({
    post: postMock,
  }),
}));

describe('NotificationChannelService', () => {
  it('should return a list of notification channels', async () => {
    postMock.mockImplementation(() => {
      return Promise.resolve({ channels: notificationChannelResponseStubs });
    });

    const channels = await NotificationChannelService.list();

    expect(channels).toEqual(notificationChannelStubs);
  });
});
