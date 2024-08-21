import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from 'app/store/configureStore';

import { NodesAgents } from './NodesAgents';
import { Form } from 'react-final-form';
import * as NodesReducer from 'app/percona/shared/core/reducers/nodes/nodes.ts'

const fetchNodesActionActionSpy = jest.spyOn(NodesReducer, 'fetchNodesAction');

jest.mock('app/percona/inventory/Inventory.service');

describe('Nodes Agents:: ', () => {

  let store = configureStore();
  let formAPI;
  render(
    <Provider store={store}>
      <Form
        onSubmit={jest.fn()}
        render={({ form }) => {
          formAPI=form;
          return <NodesAgents form={form}/>
        }}
      />
    </Provider>
  );

  it('should change the   list of agents when changing the nodes', async () => {
    await waitFor(() => {
      expect(fetchNodesActionActionSpy).toHaveBeenCalled();
    });


    fireEvent.change(screen.getByTestId('nodes-selectbox'), { target: { value: 'pmm_agent' } });
    console.log(formAPI.getState().values);
    // expect(container.querySelector('#nodes-selectbox input')).toHaveValue('pmm-agent');
  });

});
