import { render, screen, fireEvent, waitForElementToBeRemoved, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import * as reducers from 'app/percona/shared/core/reducers';
import { wrapWithGrafanaContextMock } from 'app/percona/shared/helpers/testUtils';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import { Advanced } from './Advanced';

jest.mock('app/percona/settings/Settings.service');

const updateSettingsSpy = jest.spyOn(reducers, 'updateSettingsAction');

const setup = (pmmMonitoringEnabled = true) =>
  render(
    <Provider
      store={configureStore({
        percona: {
          user: { isAuthorized: true },
          settings: {
            loading: false,
            result: {
              advisorRunIntervals: {
                rareInterval: '280800s',
                standardInterval: '86400s',
                frequentInterval: '14400s',
              },
              dataRetention: '2592000s',
              telemetryEnabled: true,
              telemetrySummaries: ['summary1', 'summary2'],
              updatesEnabled: false,
              backupEnabled: false,
              advisorEnabled: true,
              azureDiscoverEnabled: true,
              publicAddress: 'localhost',
              alertingEnabled: true,
              enableInternalPgQan: pmmMonitoringEnabled,
            },
          },
        },
        navIndex: {},
      } as StoreState)}
    >
      {wrapWithGrafanaContextMock(<Advanced />)}
    </Provider>
  );

describe('Advanced::', () => {
  beforeEach(() => {
    updateSettingsSpy.mockClear();
  });

  it('renders correctly with props', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: {
              loading: false,
              result: {
                advisorRunIntervals: {
                  rareInterval: '280800s',
                  standardInterval: '86400s',
                  frequentInterval: '14400s',
                },
                dataRetention: '2592000s',
                telemetryEnabled: true,
                telemetrySummaries: ['summary1', 'summary2'],
                updatesEnabled: false,
                backupEnabled: false,
                advisorEnabled: true,
                azureDiscoverEnabled: true,
                publicAddress: 'localhost',
                alertingEnabled: true,
              },
            },
          },
        } as unknown as StoreState)}
      >
        {wrapWithGrafanaContextMock(<Advanced />)}
      </Provider>
    );

    await waitFor(() => expect(screen.getByTestId('retention-number-input')).toHaveValue(30));
    await waitFor(() => expect(screen.getByTestId('publicAddress-text-input')).toHaveValue('localhost'));
  });

  it('calls apply changes', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: {
              loading: false,
              result: {
                advisorRunIntervals: {
                  rareInterval: '280800s',
                  standardInterval: '86400s',
                  frequentInterval: '14400s',
                },
                dataRetention: '2592000s',
                telemetryEnabled: true,
                telemetrySummaries: ['summary1', 'summary2'],
                updatesEnabled: false,
                backupEnabled: false,
                advisorEnabled: true,
                azureDiscoverEnabled: true,
                publicAddress: 'localhost',
                alertingEnabled: true,
              },
            },
          },
        } as StoreState)}
      >
        {wrapWithGrafanaContextMock(<Advanced />)}
      </Provider>
    );

    fireEvent.change(screen.getByTestId('retention-number-input'), { target: { value: 70 } });
    fireEvent.submit(screen.getByTestId('advanced-button'));

    await waitForElementToBeRemoved(() => screen.getByTestId('Spinner'));

    expect(updateSettingsSpy).toHaveBeenCalled();
  });

  it('sets correct URL from browser', async () => {
    const location = {
      ...window.location,
      host: 'pmmtest.percona.com',
    };

    Object.defineProperty(window, 'location', {
      writable: true,
      value: location,
    });

    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: {
              loading: false,
              result: {
                advisorRunIntervals: {
                  rareInterval: '280800s',
                  standardInterval: '86400s',
                  frequentInterval: '14400s',
                },
                dataRetention: '2592000s',
                telemetryEnabled: true,
                telemetrySummaries: ['summary1', 'summary2'],
                updatesEnabled: false,
                backupEnabled: false,
                advisorEnabled: true,
                azureDiscoverEnabled: true,
                publicAddress: 'localhost',
                alertingEnabled: true,
              },
            },
          },
        } as StoreState)}
      >
        {wrapWithGrafanaContextMock(<Advanced />)}
      </Provider>
    );

    fireEvent.click(screen.getByTestId('public-address-button'));

    await waitFor(() => expect(screen.getByTestId('publicAddress-text-input')).toHaveValue('pmmtest.percona.com'));
  });

  it('does not include STT check intervals in the change request if STT checks are disabled', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: {
              loading: false,
              result: {
                advisorRunIntervals: {
                  rareInterval: '280800s',
                  standardInterval: '86400s',
                  frequentInterval: '14400s',
                },
                dataRetention: '2592000s',
                telemetryEnabled: true,
                telemetrySummaries: ['summary1', 'summary2'],
                updatesEnabled: false,
                backupEnabled: false,
                advisorEnabled: false,
                azureDiscoverEnabled: true,
                publicAddress: 'localhost',
                alertingEnabled: true,
              },
            },
          },
        } as StoreState)}
      >
        {wrapWithGrafanaContextMock(<Advanced />)}
      </Provider>
    );

    fireEvent.change(screen.getByTestId('retention-number-input'), { target: { value: 70 } });
    fireEvent.submit(screen.getByTestId('advanced-button'));

    await waitForElementToBeRemoved(() => screen.getByTestId('Spinner'));

    expect(updateSettingsSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          advisor_run_intervals: undefined,
        }),
      })
    );
  });

  it('Includes STT check intervals in the change request if STT checks are enabled', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: {
              loading: false,
              result: {
                advisorRunIntervals: {
                  rareInterval: '280800s',
                  standardInterval: '86400s',
                  frequentInterval: '14400s',
                },
                dataRetention: '2592000s',
                telemetryEnabled: true,
                telemetrySummaries: ['summary1', 'summary2'],
                updatesEnabled: false,
                backupEnabled: false,
                advisorEnabled: true,
                azureDiscoverEnabled: true,
                publicAddress: 'localhost',
                alertingEnabled: true,
              },
            },
          },
          navIndex: {},
        } as StoreState)}
      >
        {wrapWithGrafanaContextMock(<Advanced />)}
      </Provider>
    );

    fireEvent.change(screen.getByTestId('retention-number-input'), { target: { value: 70 } });
    fireEvent.submit(screen.getByTestId('advanced-button'));
    await waitForElementToBeRemoved(() => screen.getByTestId('Spinner'));

    // expect(spy.calls.mostRecent().args[0].body.stt_check_intervals).toBeDefined();
    expect(updateSettingsSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          advisor_run_intervals: {
            frequent_interval: '14400s',
            rare_interval: '280800s',
            standard_interval: '86400s',
          },
        }),
      })
    );
  });

  it('updates internal monitoring when pmm server monitoring is turned on', async () => {
    const { container } = setup();

    const monitoringSwitch = container.querySelector(
      '[data-testid="enable-internal-pg-qan"] [name="enableInternalPgQan"]'
    );

    expect(monitoringSwitch).toBeInTheDocument();

    fireEvent.click(monitoringSwitch!);

    fireEvent.submit(screen.getByTestId('advanced-button'));

    await waitForElementToBeRemoved(() => screen.getByTestId('Spinner'));

    expect(updateSettingsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          enable_internal_pg_qan: false,
        }),
      })
    );
  });

  it('updates internal monitoring when pmm server monitoring is turned off', async () => {
    const { container } = setup(false);

    const monitoringSwitch = container.querySelector(
      '[data-testid="enable-internal-pg-qan"] [name="enableInternalPgQan"]'
    );

    expect(monitoringSwitch).toBeInTheDocument();

    fireEvent.click(monitoringSwitch!);

    fireEvent.submit(screen.getByTestId('advanced-button'));

    await waitForElementToBeRemoved(() => screen.getByTestId('Spinner'));

    expect(updateSettingsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          enable_internal_pg_qan: true,
        }),
      })
    );
  });

  it("doesn't update internal monitoring when pmm server monitoring doesn't change", async () => {
    setup();

    fireEvent.submit(screen.getByTestId('advanced-button'));

    await waitForElementToBeRemoved(() => screen.getByTestId('Spinner'));

    expect(updateSettingsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          enable_internal_pg_qan: true,
        }),
      })
    );
  });
});
