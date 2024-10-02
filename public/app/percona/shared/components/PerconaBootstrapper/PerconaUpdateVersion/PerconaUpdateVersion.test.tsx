import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { waitFor } from 'test/test-utils';

import * as GrafanaUpdates from 'app/percona/shared/core/reducers/updates/updates';
import * as UserTourReducer from 'app/percona/shared/core/reducers/user/user';
import { UpdatesService } from 'app/percona/shared/services/updates';
import { configureStore } from 'app/store/configureStore';

import PerconaUpdateVersion from './PerconaUpdateVersion';
import { StoreState } from 'app/types';
import { EnhancedStore } from '@reduxjs/toolkit';

const checkUpdatesChangeLogsSpy = jest.spyOn(GrafanaUpdates, 'checkUpdatesChangeLogs');
const fetchUserDetailsActionSpy = jest.spyOn(UserTourReducer, 'fetchUserDetailsAction');

describe('PerconaUpdateVersion', () => {
  const setup = (store: EnhancedStore) =>
    render(
      <Provider store={store}>
        <PerconaUpdateVersion />
      </Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal with one update', async () => {
    const state = {
      updates: {
        isLoading: false,
        updateAvailable: true,
        latest: { version: '3.0.1' },
        lastChecked: '',
        changeLogs: {
          lastCheck: '',
          updates: [
            {
              version: 'PMM 3.0.1',
              tag: 'string',
              timestamp: '2024-09-24T09:12:31.488Z',
              releaseNotesUrl: 'http://localhost:3000',
              releaseNotesText: 'text1',
            },
          ],
        },
      },
    };
    jest
      .spyOn(UpdatesService, 'getUpdatesChangelogs')
      .mockReturnValue(Promise.resolve({ ...state.updates.changeLogs }));

    const defaultState = configureStore().getState();
    const store = configureStore({
      ...defaultState,
      percona: {
        ...defaultState.percona,
        ...state,
      },
    } as StoreState);
    setup(store);
    await waitFor(() => {
      expect(checkUpdatesChangeLogsSpy).toHaveBeenCalled();
      expect(fetchUserDetailsActionSpy).toHaveBeenCalled();
    });

    expect(screen.getByTestId('one-update-modal')).toBeInTheDocument();
  });

  it('should render modal with multiple updates', async () => {
    const state = {
      updates: {
        isLoading: false,
        updateAvailable: true,
        latest: { version: '3.0.1' },
        lastChecked: '',
        changeLogs: {
          lastCheck: '',
          updates: [
            {
              version: 'PMM 3.0.1',
              tag: 'string',
              timestamp: '2024-09-24T09:12:31.488Z',
              releaseNotesUrl: 'http://localhost:3000',
              releaseNotesText: 'text1',
            },
            {
              version: 'PMM 3.0.2',
              tag: 'string',
              timestamp: '2024-09-24T09:12:31.488Z',
              releaseNotesUrl: 'http://localhost:3000',
              releaseNotesText: 'text2',
            },
          ],
        },
      },
    };
    jest
      .spyOn(UpdatesService, 'getUpdatesChangelogs')
      .mockReturnValue(Promise.resolve({ ...state.updates.changeLogs }));

    const defaultState = configureStore().getState();
    const store = configureStore({
      ...defaultState,
      percona: {
        ...defaultState.percona,
        ...state,
      },
    } as StoreState);

    setup(store);
    await waitFor(() => {
      expect(checkUpdatesChangeLogsSpy).toHaveBeenCalled();
      expect(fetchUserDetailsActionSpy).toHaveBeenCalled();
    });

    expect(screen.getByTestId('multiple-updates-modal')).toBeInTheDocument();
  });
});
