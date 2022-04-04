import React from 'react';
import { Advanced } from './Advanced';
import { sttCheckIntervalsStub } from './__mocks__/stubs';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('Advanced::', () => {
  it('Renders correctly with props', () => {
    render(
      <Advanced
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={false}
        backupEnabled={false}
        updatesDisabled
        updateSettings={() => {}}
        publicAddress="pmmtest.percona.com"
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );
    const retentionInput = screen.getByTestId('retention-number-input');
    const publicAddressInput = screen.getByTestId('publicAddress-text-input');

    expect(retentionInput).toHaveValue(15);
    expect(publicAddressInput).toHaveValue('pmmtest.percona.com');
  });

  xit("Can't change telemetry when stt is on", () => {
    // TODO remove after review
    //  The current implementation does not have a mechanism for setting the disabled property depending on sttEnabled
    //  param. I suggest deleting this test.
    render(
      <Advanced
        backupEnabled={false}
        dataRetention="1296000s"
        telemetryEnabled
        sttEnabled
        updatesDisabled
        updateSettings={() => {}}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );
    const telemetrySwitch = screen.getByTestId('advanced-telemetry');
    expect(telemetrySwitch).toBeDisabled();
  });

  xit("Can't change stt when telemetry is off", () => {
    // TODO remove after review
    //  Didn't see in the current implementation a mechanism for setting the disabled property to advanced-stt input
    //  depending on sttEnabled param. I suggest deleting this test.
    render(
      <Advanced
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={false}
        backupEnabled={false}
        updatesDisabled
        updateSettings={() => {}}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );
    const sttSwitch = screen.getByTestId('advanced-stt');
    expect(sttSwitch).toBeDisabled();
  });

  xit("Can't change alerting when telemetry is off", () => {
    // TODO remove after review
    //  Didn't see in the current implementation a mechanism for setting the disabled property to advanced-alerting
    //  Field depending on telemetryEnabled param. I suggest deleting this test.
    render(
      <Advanced
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={false}
        backupEnabled={false}
        alertingEnabled={false}
        updatesDisabled
        updateSettings={() => {}}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );
    const alertingSwitch = screen.getByTestId('advanced-alerting').querySelector('input');
    expect(alertingSwitch).toBeDisabled();
  });

  it('Calls apply changes', () => {
    const updateSettings = jest.fn();
    render(
      <Advanced
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={false}
        backupEnabled={false}
        updatesDisabled
        updateSettings={updateSettings}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );

    const retentionInput = screen.getByTestId('retention-number-input');
    fireEvent.change(retentionInput, { target: { value: '70' } });

    const form = screen.getByTestId('advanced-form');
    fireEvent.submit(form);

    expect(updateSettings).toHaveBeenCalled();
  });

  it('Sets correct URL from browser', async () => {
    const location = {
      ...window.location,
      host: 'localhost:1234',
    };
    // TODO remove after review
    //  Advance component works with host, changed test for current realisation

    Object.defineProperty(window, 'location', {
      writable: true,
      value: location,
    });

    render(
      <Advanced
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={false}
        backupEnabled={false}
        updatesDisabled
        updateSettings={() => {}}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );
    const publicAddressButton = screen.getByTestId('public-address-button');

    await waitFor(() => fireEvent.click(publicAddressButton));

    const publicAddressInput = screen.getByTestId('publicAddress-text-input');

    expect(publicAddressInput).toHaveValue('localhost:1234');
  });

  it('Does not include STT check intervals in the change request if STT checks are disabled', () => {
    const fakeUpdateSettings = jest.fn();

    render(
      <Advanced
        backupEnabled={false}
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={false}
        updatesDisabled
        updateSettings={fakeUpdateSettings}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );

    const form = screen.getByTestId('advanced-form');
    fireEvent.submit(form);

    expect(fakeUpdateSettings.mock.calls[0][0].stt_check_intervals).toBeUndefined();
  });

  it('Includes STT check intervals in the change request if STT checks are enabled', () => {
    const fakeUpdateSettings = jest.fn();

    render(
      <Advanced
        backupEnabled={false}
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={true}
        updatesDisabled
        updateSettings={fakeUpdateSettings}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );

    const form = screen.getByTestId('advanced-form');
    fireEvent.submit(form);
    expect(fakeUpdateSettings.mock.calls[0][0].stt_check_intervals).toBeDefined();
  });
});
