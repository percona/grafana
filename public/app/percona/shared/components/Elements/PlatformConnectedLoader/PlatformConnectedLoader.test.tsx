import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';
import { PlatformConnectedLoader } from '.';

describe('PlatformConnectedLoader', () => {
  it('should render error if user is not percona account', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true, isPlatformUser: false },
            settings: { loading: false, result: { isConnectedToPortal: true } },
          },
        } as StoreState)}
      >
        <PlatformConnectedLoader></PlatformConnectedLoader>
      </Provider>
    );
    expect(screen.getByTestId('not-platform-user')).toBeInTheDocument();
  });
});
