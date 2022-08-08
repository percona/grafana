import React from 'react';
import { render, screen } from '@testing-library/react';
import DBaaSRouting from './DBaaSRouting';
import { configureStore } from '../../../../store/configureStore';
import { StoreState } from '../../../../types';
import { Provider } from 'react-redux';

describe('SwitchField::', () => {
  it('should should show loading when we are waiting kubernetes response', () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: { result: { dbaasEnabled: true } },
            kubernetes: {
              loading: true,
            },
          },
        } as StoreState)}
      >
        <DBaaSRouting />
      </Provider>
    );

    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
  });

  it('should return redirect to dbclusters  if we have one or more kubernetes clusters', async () => {
    //
  });

  it('should should show loading and DBaaS when we are waiting kubernetes response', async () => {
    //
  });
});
