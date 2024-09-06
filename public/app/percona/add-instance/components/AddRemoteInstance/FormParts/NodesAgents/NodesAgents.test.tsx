import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';

import * as NodesReducer from 'app/percona/shared/core/reducers/nodes/nodes.ts';
import { configureStore } from 'app/store/configureStore';

import { NodesAgents } from './NodesAgents';

const fetchNodesActionActionSpy = jest.spyOn(NodesReducer, 'fetchNodesAction');

jest.mock('app/percona/inventory/Inventory.service');

const submitMock = jest.fn();

describe('Nodes Agents:: ', () => {
  render(
    <Provider store={configureStore()}>
      <Form
        onSubmit={submitMock}
        render={({ handleSubmit, form }) => (
          <form data-testid="node-agents-form" onSubmit={handleSubmit}>
            <NodesAgents form={form} />
          </form>
        )}
      />
    </Provider>
  );

  it('should change the   list of agents when changing the nodes', async () => {
    await waitFor(() => {
      expect(fetchNodesActionActionSpy).toHaveBeenCalled();
    });

    const form = screen.getByTestId('node-agents-form');

    const nodesSelect = screen.getByLabelText('Nodes');
    await selectEvent.select(nodesSelect, 'pmm-server', { container: document.body });

    fireEvent.submit(form);

    expect(submitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        node: expect.objectContaining({
          value: 'pmm-server',
        }),
        pmm_agent_id: expect.objectContaining({
          value: 'pmm-agent',
        }),
      }),
      expect.anything(),
      expect.anything()
    );
  });
});
