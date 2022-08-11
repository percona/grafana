import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import { Alerts } from './Alerts';

describe('AlertsTable', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the table correctly', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: { loading: false, result: { isConnectedToPortal: true, alertingEnabled: true } },
          },
        } as StoreState)}
      >
        <Alerts />
      </Provider>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('table-loading'));

    expect(screen.getAllByRole('row')).toHaveLength(1 + 6);
    expect(screen.queryByTestId('table-no-data')).not.toBeInTheDocument();
  });

  it('should render correctly without data', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: { loading: false, result: { isConnectedToPortal: true, alertingEnabled: true } },
          },
        } as StoreState)}
      >
        <Alerts />
      </Provider>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('table-loading'));
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByTestId('table-no-data')).toBeInTheDocument();
  });
});
