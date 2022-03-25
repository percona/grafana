import React from 'react';
import { logger } from '@percona/platform-core';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { configureStore } from 'app/store/configureStore';
import { Provider } from 'react-redux';
import { CheckService } from 'app/percona/check/Check.service';
import { FailedChecksTab } from './FailedChecksTab';

jest.mock('@percona/platform-core', () => {
  const originalModule = jest.requireActual('@percona/platform-core');
  return {
    ...originalModule,
    logger: {
      error: jest.fn(),
    },
  };
});

describe('FailedChecksTab::', () => {
  let getAlertsSpy = jest.spyOn(CheckService, 'getActiveAlerts').mockImplementation(() => Promise.resolve([]));

  afterEach(() => getAlertsSpy.mockClear());

  it('should fetch active alerts at startup', async () => {
    act(() => {
      render(
        <Provider
          store={configureStore({
            percona: {
              user: { isAuthorized: true, isConnectedToPortal: false },
              settings: { result: { sttEnabled: true } },
            },
          })}
        >
          <FailedChecksTab />
        </Provider>
      );
    });

    await screen.findByTestId('db-checks-failed-checks-toggle-silenced');
    expect(CheckService.getActiveAlerts).toHaveBeenCalledTimes(1);
  });

  it('should render a spinner at startup, while loading', async () => {
    act(() => {
      render(
        <Provider
          store={configureStore({
            percona: {
              user: { isAuthorized: true, isConnectedToPortal: false },
              settings: { result: { sttEnabled: true } },
            },
          })}
        >
          <FailedChecksTab />
        </Provider>
      );
    });

    expect(screen.queryByTestId('db-checks-failed-checks-spinner')).toBeInTheDocument();

    await screen.findByTestId('db-checks-failed-checks-toggle-silenced');

    expect(screen.queryByTestId('db-checks-failed-checks-spinner')).not.toBeInTheDocument();
  });

  it('should log an error if the fetch alerts API call fails', async () => {
    getAlertsSpy.mockImplementationOnce(() => {
      throw Error('test');
    });
    const loggerSpy = jest.spyOn(logger, 'error');

    act(() => {
      render(
        <Provider
          store={configureStore({
            percona: {
              user: { isAuthorized: true, isConnectedToPortal: false },
              settings: { result: { sttEnabled: true } },
            },
          })}
        >
          <FailedChecksTab />
        </Provider>
      );
    });

    await screen.findByTestId('db-checks-failed-checks-toggle-silenced');

    expect(loggerSpy).toBeCalledTimes(1);

    loggerSpy.mockClear();
  });

  it('should call the API to run checks when the "run checks" button gets clicked', async () => {
    const runChecksSpy = jest.spyOn(CheckService, 'runDbChecks');
    act(() => {
      render(
        <Provider
          store={configureStore({
            percona: {
              user: { isAuthorized: true, isConnectedToPortal: false },
              settings: { result: { sttEnabled: true } },
            },
          })}
        >
          <FailedChecksTab />
        </Provider>
      );
    });

    await screen.findByTestId('db-checks-failed-checks-toggle-silenced');

    const runChecksButton = screen.getByRole('button');

    expect(runChecksSpy).toBeCalledTimes(0);
    fireEvent.click(runChecksButton);

    await screen.findByTestId('db-checks-failed-checks-toggle-silenced');

    expect(runChecksSpy).toBeCalledTimes(1);

    runChecksSpy.mockClear();
  });

  it('should render a table after having fetched the alerts', async () => {
    act(() => {
      render(
        <Provider
          store={configureStore({
            percona: {
              user: { isAuthorized: true, isConnectedToPortal: false },
              settings: { result: { sttEnabled: true } },
            },
          })}
        >
          <FailedChecksTab />
        </Provider>
      );
    });

    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    await screen.findByTestId('db-checks-failed-checks-toggle-silenced');

    expect(screen.queryByTestId('db-check-panel-table-empty')).toBeInTheDocument();
  });
});
