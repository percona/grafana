import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import * as ServicesReducer from 'app/percona/shared/core/reducers/services/services';
import { configureStore } from 'app/store/configureStore';

import DeleteServiceModal from './DeleteServiceModal';

const cancelFn = jest.fn();

jest.mock('app/percona/inventory/Inventory.service');
jest.mock('app/percona/shared/services/services/Services.service');

const renderDefaults = (isOpen = true) =>
  render(
    <Provider store={configureStore()}>
      <DeleteServiceModal onCancel={cancelFn} isOpen={isOpen} serviceId="service_id" serviceName="service_name" />
    </Provider>
  );

describe('DeleteServiceModal::', () => {
  beforeEach(() => {
    cancelFn.mockClear();
  });

  it("doesn't render if not opened", () => {
    renderDefaults(false);
    expect(screen.queryByTestId('delete-service-description')).toBe(null);
  });

  it('renders when opened', () => {
    renderDefaults();
    expect(screen.queryByTestId('delete-service-description')).toBeInTheDocument();
  });

  it('can be cancelled', () => {
    renderDefaults();

    const cancelButton = screen.getByTestId('delete-service-cancel');
    fireEvent.click(cancelButton);

    expect(cancelFn).toHaveBeenCalled();
  });

  it('calls delete', () => {
    const removeServiceActionSpy = jest.spyOn(ServicesReducer, 'removeServiceAction');

    renderDefaults();

    const confirmButton = screen.getByTestId('delete-service-confirm');
    fireEvent.click(confirmButton);

    expect(removeServiceActionSpy).toHaveBeenCalledWith({
      force: false,
      serviceId: 'service_id',
    });
  });

  it('calls delete with force mode', async () => {
    const removeServiceActionSpy = jest.spyOn(ServicesReducer, 'removeServiceAction');

    renderDefaults();

    const forceModeCheck = screen.getByTestId('delete-service-force-mode');
    await waitFor(() => fireEvent.click(forceModeCheck));

    const confirmButton = screen.getByTestId('delete-service-confirm');
    await waitFor(() => fireEvent.click(confirmButton));

    expect(removeServiceActionSpy).toHaveBeenCalledWith({
      force: true,
      serviceId: 'service_id',
    });
  });

  it('resets force mode after submit', async () => {
    renderDefaults();

    const forceModeCheck = screen.getByTestId('delete-service-force-mode');
    await waitFor(() => fireEvent.click(forceModeCheck));

    expect(forceModeCheck).toBeChecked();

    const confirmButton = screen.getByTestId('delete-service-confirm');
    fireEvent.click(confirmButton);

    await waitFor(() => expect(forceModeCheck).not.toBeChecked());
  });

  it('resets force mode after dismiss', async () => {
    renderDefaults();

    const forceModeCheck = screen.getByTestId('delete-service-force-mode');
    await waitFor(() => fireEvent.click(forceModeCheck));

    expect(forceModeCheck).toBeChecked();

    const cancelButton = screen.getByTestId('delete-service-cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => expect(forceModeCheck).not.toBeChecked());
  });
});
