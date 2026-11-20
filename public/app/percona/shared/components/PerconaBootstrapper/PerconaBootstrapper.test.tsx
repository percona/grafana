import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import { OrgRole } from '@grafana/data';
import { config } from '@grafana/runtime';
import { SettingsService } from 'app/percona/settings/Settings.service';
import { AdvisorsService } from 'app/percona/shared/services/advisors/Advisors.service';
import { HighAvailabilityService } from 'app/percona/shared/services/highAvailability/HighAvailability.service';
import { UpdatesService } from 'app/percona/shared/services/updates';
import { UserService } from 'app/percona/shared/services/user/User.service';
import { configureStore } from 'app/store/configureStore';

import { PerconaBootstrapper } from './PerconaBootstrapper';

jest.mock('app/percona/settings/Settings.service');

const originalUser = config.bootData.user;

describe('PerconaBootstrapper', () => {
  const onReady = jest.fn();

  const setup = () => {
    const store = configureStore();
    render(
      <Provider store={store}>
        <PerconaBootstrapper onReady={onReady} />
      </Provider>
    );
    return store;
  };

  const mockSettings = async (updatesEnabled: boolean) => {
    // the module mock resolves a complete Settings stub
    const settings = await SettingsService.getSettings();
    jest.spyOn(SettingsService, 'getSettings').mockResolvedValue({ ...settings, updatesEnabled });
  };

  beforeEach(async () => {
    config.bootData.user = {
      ...originalUser,
      isSignedIn: true,
      isGrafanaAdmin: true,
      orgRole: OrgRole.Admin,
    };
    await mockSettings(true);
    jest.spyOn(AdvisorsService, 'list').mockResolvedValue({ advisors: [] });
    jest.spyOn(UserService, 'getUserDetails').mockResolvedValue({ user_id: 1 });
    jest.spyOn(HighAvailabilityService, 'getStatus').mockResolvedValue({ status: 'Disabled' });
  });

  afterEach(() => {
    config.bootData.user = originalUser;
    jest.restoreAllMocks();
    onReady.mockClear();
  });

  it('calls onReady while the update check is still pending', async () => {
    jest.spyOn(UpdatesService, 'getCurrentVersion').mockReturnValue(new Promise(() => {}));

    setup();

    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    expect(UpdatesService.getCurrentVersion).toHaveBeenCalledWith({ force: false });
  });

  it('calls onReady without checking updates when updates are disabled', async () => {
    await mockSettings(false);
    const getCurrentVersion = jest.spyOn(UpdatesService, 'getCurrentVersion');

    setup();

    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    expect(getCurrentVersion).not.toHaveBeenCalled();
  });

  it('clears the updates loading state when the check fails', async () => {
    jest.spyOn(UpdatesService, 'getCurrentVersion').mockRejectedValue(new Error('offline'));

    const store = setup();

    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(store.getState().percona.updates.isLoading).toBe(false));
  });
});
