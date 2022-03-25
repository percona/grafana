import React from 'react';
import { configureStore } from 'app/store/configureStore';
import { Provider } from 'react-redux';
import { BackupInventory } from './BackupInventory';
import { render, screen } from '@testing-library/react';

jest.mock('./BackupInventory.service');
jest.mock('../../hooks/recurringCall.hook');

describe('BackupInventory', () => {
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
        <BackupInventory />
      </Provider>
    );

    await screen.findByText('Backup 1');
    expect(screen.getByText('Location 1')).toBeTruthy();
  });
});
