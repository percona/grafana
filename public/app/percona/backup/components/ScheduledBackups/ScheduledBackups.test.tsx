import React from 'react';
import { render, screen } from '@testing-library/react';
import { configureStore } from 'app/store/configureStore';
import { Provider } from 'react-redux';
import { ScheduledBackups } from './ScheduledBackups';

jest.mock('./ScheduledBackups.service');

describe('ScheduledBackups', () => {
  it('should send correct data to Table', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true, isConnectedToPortal: false },
            settings: { result: { backupEnabled: true } },
          },
        })}
      >
        <ScheduledBackups />
      </Provider>
    );
    await screen.findByText('Backup 1');
    expect(screen.getByText('Location 1')).toBeTruthy();
  });
});
