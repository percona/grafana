import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import { locationService } from '@grafana/runtime';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import { Platform } from './Platform';

describe('Platform::', () => {
  it('shows form to connect if not connected', () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: { loading: false, result: { isConnectedToPortal: false } },
          },
        } as StoreState)}
      >
        <Router history={locationService.getHistory()}>
          <Platform />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('connect-form')).toBeInTheDocument();
  });

  it('shows connected message if connected', () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: { loading: false, result: { isConnectedToPortal: true } },
          },
        } as StoreState)}
      >
        <Router history={locationService.getHistory()}>
          <Platform />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('connected-wrapper')).toBeInTheDocument();
  });
});
