import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import { ScheduledBackups } from './ScheduledBackups';

jest.mock('./ScheduledBackups.service');

describe('ScheduledBackups', () => {
  it('should send correct data to Table', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true, isPlatformUser: false },
            settings: { result: { backupEnabled: true, isConnectedToPortal: false } },
          },
        } as StoreState)}
      >
        <ScheduledBackups />
      </Provider>
    );
    await screen.findByText('Backup 1');
    expect(screen.getByText('Location 1')).toBeTruthy();
  });
});