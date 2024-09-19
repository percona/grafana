import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from 'app/store/configureStore';

import { NodesAgents } from './NodesAgents';
import { Form } from 'react-final-form';
import * as NodesReducer from 'app/percona/shared/core/reducers/nodes/nodes';
import selectEvent from 'react-select-event';
import { FormApi } from 'final-form';

const fetchNodesActionActionSpy = jest.spyOn(NodesReducer, 'fetchNodesAction');

jest.mock('app/percona/inventory/Inventory.service');

describe('Nodes Agents:: ', () => {
  let store = configureStore();
  let formAPI: FormApi<any>;
  render(
    <Provider store={store}>
      <Form
        onSubmit={jest.fn()}
        render={({ form }) => {
          formAPI = form;
          return <NodesAgents form={form} />;
        }}
      />
    </Provider>
  );

  it('should pick the pmm-server agent when pmm-server node is picked', async () => {
    await waitFor(() => {
      expect(fetchNodesActionActionSpy).toHaveBeenCalled();
    });
    const nodesSelect = screen.getByLabelText('Nodes');
    await selectEvent.select(nodesSelect, ['pmm-server'], { container: document.body });

    // const agentsSelect = screen.getByLabelText('Agents');
    const formValues = formAPI.getState().values;
    expect(formValues.pmm_agent_id.value).toBe('pmm-server');
    expect(formValues.node.value).toBe('pmm-server');
  });
});
