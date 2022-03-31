import React from 'react';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { logger } from '@percona/platform-core';
import { CheckService } from 'app/percona/check/Check.service';
import { Interval } from 'app/percona/check/types';
import { AllChecksTab } from './AllChecksTab';
import { Messages } from './AllChecksTab.messages';

jest.mock('@percona/platform-core', () => {
  const originalModule = jest.requireActual('@percona/platform-core');
  return {
    ...originalModule,
    logger: {
      error: jest.fn(),
    },
  };
});

describe('AllChecksTab::', () => {
  it('should fetch checks at startup', async () => {
    const spy = jest.spyOn(CheckService, 'getAllChecks');
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true, isPlatformUser: false },
            settings: { result: { sttEnabled: true, isConnectedToPortal: false } },
          },
        } as StoreState)}
      >
        <AllChecksTab />
      </Provider>
    );

    await screen.findByTestId('db-checks-all-checks-wrapper');

    expect(spy).toBeCalledTimes(1);

    spy.mockClear();
  });

  it('should render a spinner at startup, while loading', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true, isPlatformUser: false },
            settings: { result: { sttEnabled: true, isConnectedToPortal: false } },
          },
        } as StoreState)}
      >
        <AllChecksTab />
      </Provider>
    );

    await screen.findByTestId('db-checks-all-checks-spinner');
    expect(screen.getByTestId('db-checks-all-checks-spinner')).toBeInTheDocument();
  });

  it('should log an error if the API call fails', async () => {
    const spy = jest.spyOn(CheckService, 'getAllChecks').mockImplementation(() => {
      throw Error('test');
    });
    const loggerSpy = jest.spyOn(logger, 'error').mockImplementationOnce(() => null);

    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true, isPlatformUser: false },
            settings: { result: { sttEnabled: true, isConnectedToPortal: false } },
          },
        } as StoreState)}
      >
        <AllChecksTab />
      </Provider>
    );

    await screen.findByTestId('db-checks-all-checks-wrapper');
    expect(loggerSpy).toBeCalledTimes(1);

    spy.mockClear();
  });

  it('should render a table', async () => {
    jest.spyOn(CheckService, 'getAllChecks').mockImplementation(() =>
      Promise.resolve([
        {
          summary: 'Test',
          name: 'test enabled',
          description: 'test enabled description',
          interval: 'STANDARD',
          disabled: false,
        },
        {
          summary: 'Test disabled',
          name: 'test disabled',
          description: 'test disabled description',
          interval: 'RARE',
          disabled: true,
        },
      ])
    );

    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true, isPlatformUser: false },
            settings: { result: { sttEnabled: true, isConnectedToPortal: false } },
          },
        } as StoreState)}
      >
        <AllChecksTab />
      </Provider>
    );

    await screen.findByTestId('db-checks-all-checks-wrapper');
    const cells = screen.getAllByRole('cell');

    expect(screen.getAllByTestId('db-checks-all-checks-table')).toHaveLength(1);
    expect(screen.getAllByTestId('db-checks-all-checks-thead')).toHaveLength(1);
    expect(screen.getAllByTestId('db-checks-all-checks-tbody')).toHaveLength(1);
    expect(cells).toHaveLength(10);
    expect(cells[0].textContent).toBe('Test');
    expect(cells[1].textContent).toBe('test enabled description');
    expect(cells[2].textContent).toBe(Messages.enabled);
    expect(cells[3].textContent).toBe(Interval.STANDARD);
    expect(cells[4].textContent).toBe(Messages.disable);
    expect(cells[5].textContent).toBe('Test disabled');
    expect(cells[6].textContent).toBe('test disabled description');
    expect(cells[7].textContent).toBe(Messages.disabled);
    expect(cells[8].textContent).toBe(Interval.RARE);
    expect(cells[9].textContent).toBe(Messages.enable);
  });
});
