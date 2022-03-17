import React from 'react';
import { activeCheckStub } from 'app/percona/check/__mocks__/stubs';
import { SilenceAlertButton } from 'app/percona/check/components';
import { AlertsReloadContext } from 'app/percona/check/Check.context';
import { CheckService } from 'app/percona/check/Check.service';
import { makeSilencePayload } from './SilenceAlertButton.utils';
import { logger } from '@percona/platform-core';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('../../Check.service');
jest.mock('app/percona/shared/components/hooks/cancelToken.hook');
jest.mock('./SilenceAlertButton.utils', () => ({
  makeSilencePayload: jest.fn(() => 'testPayload'),
}));
jest.mock('@percona/platform-core', () => {
  const originalModule = jest.requireActual('@percona/platform-core');
  return {
    ...originalModule,
    logger: {
      error: jest.fn(),
    },
  };
});

const mockedMakeSilencePayload = makeSilencePayload as jest.Mock;

describe('SilenceAlertButton::', () => {
  afterEach(() => {
    mockedMakeSilencePayload.mockClear();
  });

  it('should contain a LoaderButton', () => {
    const { labels } = activeCheckStub[0].details[0];

    render(<SilenceAlertButton labels={labels} />);

    expect(screen.getAllByTestId('silence-loader-button')).toHaveLength(1);
  });

  it('should call functions to buind the payload and to call the API to silence an alert on click', async () => {
    const { labels } = activeCheckStub[0].details[0];

    (window as any).grafanaBootData = {
      user: {
        name: 'test_user',
      },
    };

    const fakeFetchAlerts = jest.fn();

    const spy = jest.spyOn(CheckService, 'silenceAlert');

    render(
      <AlertsReloadContext.Provider value={{ fetchAlerts: fakeFetchAlerts }}>
        <SilenceAlertButton labels={labels} />
      </AlertsReloadContext.Provider>
    );

    expect(mockedMakeSilencePayload).toBeCalledTimes(0);
    expect(spy).toBeCalledTimes(0);
    expect(fakeFetchAlerts).toBeCalledTimes(0);

    const loaderButton = screen.getByTestId('silence-loader-button');
    await waitFor(() => fireEvent.click(loaderButton));

    expect(mockedMakeSilencePayload).toBeCalledTimes(1);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('testPayload');
    expect(fakeFetchAlerts).toBeCalledTimes(1);

    spy.mockClear();
  });

  it('should call functions to buind the payload and to call the API to silence an alert on click', async () => {
    const { labels } = activeCheckStub[0].details[0];

    (window as any).grafanaBootData = {
      user: {
        name: 'test_user',
      },
    };

    const spy = jest.spyOn(CheckService, 'silenceAlert');

    spy.mockImplementation(() => {
      throw Error('Test error');
    });

    render(<SilenceAlertButton labels={labels} />);

    const loaderButton = screen.getByTestId('silence-loader-button');
    fireEvent.click(loaderButton);

    expect(logger.error).toBeCalledTimes(1);
    expect(logger.error).toBeCalledWith(Error('Test error'));

    spy.mockClear();
  });
});
