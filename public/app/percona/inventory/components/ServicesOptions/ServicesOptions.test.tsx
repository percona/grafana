import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { HistoryWrapper, locationService, setLocationService } from '@grafana/runtime';
import { configureStore } from 'app/store/configureStore';

import ServicesOptions from './ServicesOptions';
import { Messages } from './ServicesOptions.messages';

const serviceStub = {
  service_id: 'service_id',
  service_name: 'service_name',
};

const renderWithDefaults = () =>
  render(
    <Provider store={configureStore()}>
      <ServicesOptions service={serviceStub} />
    </Provider>
  );

describe('ServicesOptions::', () => {
  beforeEach(() => {
    setLocationService(new HistoryWrapper());
  });

  it('renders options button', () => {
    renderWithDefaults();
    expect(screen.getByLabelText(Messages.optionsAriaLabel)).toBeInTheDocument();
  });

  it('opens menu after clicking', async () => {
    renderWithDefaults();

    const optionsButton = screen.getByLabelText(Messages.optionsAriaLabel);
    fireEvent.click(optionsButton);

    await waitFor(() => expect(screen.queryByLabelText(Messages.editAria)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByLabelText(Messages.deleteAria)).toBeInTheDocument());
  });

  it('navigates to edit page', async () => {
    renderWithDefaults();

    const optionsButton = screen.getByLabelText(Messages.optionsAriaLabel);
    await waitFor(() => fireEvent.click(optionsButton));

    await waitFor(() => expect(screen.queryByLabelText(Messages.editAria)).toBeInTheDocument());

    const editOption = screen.getByLabelText(Messages.editAria);
    await waitFor(() => editOption.click());

    expect(locationService.getLocation().pathname).toBe('/edit-instance/service_id');
  });

  it('opens delete modal', async () => {
    renderWithDefaults();

    const optionsButton = screen.getByLabelText(Messages.optionsAriaLabel);
    await waitFor(() => fireEvent.click(optionsButton));

    await waitFor(() => expect(screen.queryByLabelText(Messages.editAria)).toBeInTheDocument());

    const deleteOption = screen.getByLabelText(Messages.deleteAria);
    await waitFor(() => deleteOption.click());

    await waitFor(() => expect(screen.getByTestId('delete-service-confirm')).toBeInTheDocument());
  });
});
