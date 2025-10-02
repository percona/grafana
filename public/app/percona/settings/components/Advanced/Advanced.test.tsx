import { render, screen, fireEvent, waitForElementToBeRemoved, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import { InventoryService } from 'app/percona/inventory/Inventory.service';
import { AgentType } from 'app/percona/inventory/Inventory.types';
import { Databases } from 'app/percona/shared/core';
import * as reducers from 'app/percona/shared/core/reducers';
import { wrapWithGrafanaContextMock } from 'app/percona/shared/helpers/testUtils';
import { Service, ServiceStatus } from 'app/percona/shared/services/services/Services.types';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import { Advanced } from './Advanced';
import { PMM_SERVER_AGENT_NODE_ID, PMM_SERVER_AGENT_SERVICE_NAME } from './Advanced.constants';
import { act } from 'react';

jest.mock('app/percona/settings/Settings.service');
jest.mock('app/percona/shared/services/services/Services.service');

const updateAgentSpy = jest.spyOn(InventoryService, 'updateAgent').mockImplementation(() => Promise.resolve({}));

const setup = (pmmMonitoringEnabled = true) => {
  const pmmServerService: Service = {
    type: Databases.postgresql,
    params: {
      serviceId: 'service-id',
      nodeName: 'node-name',
      status: ServiceStatus.UP,
      serviceName: PMM_SERVER_AGENT_SERVICE_NAME,
      nodeId: PMM_SERVER_AGENT_NODE_ID,
      agents: [
        {
          disabled: !pmmMonitoringEnabled,
          agentId: 'agent-id',
          agentType: AgentType.qanPostgresql_pgstatements_agent,
        },
      ],
    },
  };

  return render(
    <Provider
      store={configureStore({
        percona: {
          user: { isAuthorized: true },
          services: {
            isLoading: false,
            services: [pmmServerService],
          },
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
};

describe('Advanced::', () => {
  beforeEach(() => {
    updateAgentSpy.mockClear();
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
    const spy = jest.spyOn(reducers, 'updateSettingsAction');
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

    expect(spy).toHaveBeenCalled();
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
    const spy = jest.spyOn(reducers, 'updateSettingsAction');

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

    // expect(spy.calls.mostRecent().args[0].body.stt_check_intervals).toBeUndefined();
    expect(spy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          advisor_run_intervals: undefined,
        }),
      })
    );
  });

  it('Includes STT check intervals in the change request if STT checks are enabled', async () => {
    const spy = jest.spyOn(reducers, 'updateSettingsAction');

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
    expect(spy).toHaveBeenLastCalledWith(
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

  it('updates agent when pmm server monitoring is turned on', async () => {
    const { container } = setup();

    const monitoringSwitch = container.querySelector(
      '[data-testid="pmm-server-monitoring"] [name="pmmServerMonitoringEnabled"]'
    );

    expect(monitoringSwitch).toBeInTheDocument();

    fireEvent.click(monitoringSwitch!);

    fireEvent.submit(screen.getByTestId('advanced-button'));

    await waitForElementToBeRemoved(() => screen.getByTestId('Spinner'));

    expect(updateAgentSpy).toHaveBeenCalledWith('agent-id', {
      qan_postgresql_pgstatements_agent: {
        enable: false,
      },
    });
  });

  it('updates agent when pmm server monitoring is turned off', async () => {
    const { container } = setup(false);

    const monitoringSwitch = container.querySelector(
      '[data-testid="pmm-server-monitoring"] [name="pmmServerMonitoringEnabled"]'
    );

    expect(monitoringSwitch).toBeInTheDocument();

    fireEvent.click(monitoringSwitch!);

    fireEvent.submit(screen.getByTestId('advanced-button'));

    await waitForElementToBeRemoved(() => screen.getByTestId('Spinner'));

    expect(updateAgentSpy).toHaveBeenCalledWith('agent-id', {
      qan_postgresql_pgstatements_agent: {
        enable: true,
      },
    });
  });

  it("doesn't updates agent when pmm server monitoring doesn't change", async () => {
    setup();

    fireEvent.submit(screen.getByTestId('advanced-button'));

    await waitForElementToBeRemoved(() => screen.getByTestId('Spinner'));

    expect(updateAgentSpy).not.toHaveBeenCalled();
  });
});
