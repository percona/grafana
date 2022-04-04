import React from 'react';
import { AlertsActions } from './AlertsActions';
import { alertsStubs } from '../__mocks__/alertsStubs';
import { formatAlert } from '../Alerts.utils';
import { AlertsService } from '../Alerts.service';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

jest.mock('app/percona/shared/components/hooks/cancelToken.hook');
jest.mock('../Alerts.service');
jest.mock('app/core/core', () => ({
  appEvents: {
    emit: jest.fn(),
  },
}));

const fakeGetAlerts = jest.fn();

const alertsServiceToggle = jest.spyOn(AlertsService, 'toggle');

describe('AlertActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a barred bell for an active alert', () => {
    render(<AlertsActions alert={formatAlert(alertsStubs.alerts[0])} getAlerts={fakeGetAlerts} />);

    expect(screen.getByTestId('bell-barred-svg')).toBeInTheDocument();
  });

  it('renders a bell for an silenced alert', () => {
    render(<AlertsActions alert={formatAlert(alertsStubs.alerts[3])} getAlerts={fakeGetAlerts} />);

    expect(screen.getByTestId('bell-svg')).toBeInTheDocument();
  });

  it('calls the API to activate a silenced alert', async () => {
    render(<AlertsActions alert={formatAlert(alertsStubs.alerts[3])} getAlerts={fakeGetAlerts} />);

    const btn = screen.getByTestId('silence-alert-button');
    await waitFor(() => fireEvent.click(btn));

    expect(alertsServiceToggle).toBeCalledTimes(1);
    expect(alertsServiceToggle).toBeCalledWith({ alert_ids: ['4'], silenced: 'FALSE' }, undefined);
  });

  it('calls the API to silence an active alert', async () => {
    render(<AlertsActions alert={formatAlert(alertsStubs.alerts[1])} getAlerts={fakeGetAlerts} />);

    const btn = screen.getByTestId('silence-alert-button');
    await waitFor(() => fireEvent.click(btn));

    expect(alertsServiceToggle).toBeCalledTimes(1);
    expect(alertsServiceToggle).toBeCalledWith({ alert_ids: ['2'], silenced: 'TRUE' }, undefined);
  });
});
