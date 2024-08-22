import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from 'app/store/configureStore';

import { NodesAgents } from './NodesAgents';
import { Form } from 'react-final-form';
import * as NodesReducer from 'app/percona/shared/core/reducers/nodes/nodes.ts'
import selectEvent from "react-select-event";

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
    const nodesSelect = screen.getByLabelText('Nodes');
    await selectEvent.select(nodesSelect, ['pmm-server'], { container: document.body });

    const agentsSelect = screen.getByLabelText('Agents');
    const formValues = formAPI.getState().values;
    expect(formValues.pmm_agent_id.value).toBe('pmm-agent');
    expect(formValues.node.value).toBe('pmm-server');
  });

});
