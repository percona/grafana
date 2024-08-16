import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';

import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import { NodesAgents } from './NodesAgents';

describe('Nodes Agents:: ', () => {
  render(
    <Provider
      store={configureStore({
        percona: {
          user: { isAuthorized: true, isPlatformUser: false },
          settings: { result: { backupEnabled: true, isConnectedToPortal: false } },
        },
      } as StoreState)}
  >
      <Form onSubmit={jest.fn()}>
        <NodesAgents />
      </Form>
    </Provider>
  );

  it('should change the   list of agents when changing the nodes', () => {
    const nodesValue = screen.getByTestId('nodes-selectbox');
    fireEvent.change(nodesValue, { target: { value: 'pmm-agent' } });

    expect(screen.getByTestId('agents-selectbox')).toHaveValue('pmm-agent');
  });

});
