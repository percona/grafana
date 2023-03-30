import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import * as fileService from 'app/percona/shared/services/file/File.service';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import PrometheusConfiguration from './PrometheusConfiguration';

jest.mock('app/percona/shared/services/file/File.service');

const renderDefault = () =>
  render(
    <Provider
      store={configureStore({
        percona: {
          user: { isAuthorized: true },
          settings: {
            loading: false,
            result: {},
          },
        },
      } as StoreState)}
    >
      <PrometheusConfiguration />
    </Provider>
  );

describe('PrometheusConfiguration::', () => {
  it("doesn't allow submit if the form is not dirty", async () => {
    renderDefault();

    await waitFor(() => expect(screen.queryByText('Loading ...')).toBeNull());

    expect(screen.getByTestId('submit-configuration')).toBeDisabled();
  });

  it('allows submit if the form is dirty', async () => {
    renderDefault();

    await waitFor(() => expect(screen.queryByText('Loading ...')).toBeNull());

    fireEvent.change(screen.getByTestId('configuration-input'), { target: { value: 'value' } });

    expect(screen.getByTestId('submit-configuration')).toBeEnabled();
  });

  it('updates file when saved', async () => {
    const updateFileSpy = jest.spyOn(fileService.FileService, 'update');
    renderDefault();

    await waitFor(() => expect(screen.queryByText('Loading ...')).toBeNull());

    fireEvent.change(screen.getByTestId('configuration-input'), { target: { value: 'value' } });

    fireEvent.click(screen.getByTestId('submit-configuration'));

    await waitFor(() => expect(updateFileSpy).toHaveBeenCalled());
  });
});
