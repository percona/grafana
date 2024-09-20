import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormApi } from 'final-form';
import React from 'react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';

import { InventoryService } from 'app/percona/inventory/Inventory.service';
import { nodesMockMultipleAgentsNoPMMServer, nodesMock } from 'app/percona/inventory/__mocks__/Inventory.service';
import { fetchNodesAction } from 'app/percona/shared/core/reducers/nodes/nodes';
import * as NodesReducer from 'app/percona/shared/core/reducers/nodes/nodes';
import { configureStore } from 'app/store/configureStore';

import { NodesAgents } from './NodesAgents';

const fetchNodesActionActionSpy = jest.spyOn(NodesReducer, 'fetchNodesAction');

describe('Nodes Agents:: ', () => {
  let formAPI: FormApi<any>;
  const submitMock = jest.fn();

  function setup() {
    render(
      <Provider store={configureStore()}>
        <Form
          onSubmit={submitMock}
          render={({ handleSubmit, form }) => {
            formAPI = form;
            return (
              <form data-testid="node-agents-form" onSubmit={handleSubmit}>
                <NodesAgents form={form} />
              </form>
            );
          }}
        />
      </Provider>
    );
  }

  it('should not pick any agent when the selected node is not pmm-server', async () => {
    jest
      .spyOn(InventoryService, 'getNodes')
      .mockReturnValue(Promise.resolve({ nodes: nodesMockMultipleAgentsNoPMMServer }));
    setup();
    await waitFor(() => {
      expect(fetchNodesActionActionSpy).toHaveBeenCalled();
    });

    const nodesSelect = screen.getByLabelText('Nodes');
    await selectEvent.select(nodesSelect, [nodesMockMultipleAgentsNoPMMServer[0].node_name], {
      container: document.body,
    });

    const formValues = formAPI.getState().values;
    expect(formValues.pmm_agent_id).toBe(undefined);
    expect(formValues.node.value).toBe(nodesMockMultipleAgentsNoPMMServer[0].node_id);
  });

  it('should pick the pmm-server from the list of agents when pmm-server node is chosen', async () => {
    InventoryService.getNodes = () =>
      Promise.resolve({
        nodes: nodesMock,
      });
    setup();
    await waitFor(() => {
      expect(fetchNodesActionActionSpy).toHaveBeenCalled();
    });
    const nodesSelect = screen.getByLabelText('Nodes');
    await selectEvent.select(nodesSelect, ['pmm-server'], { container: document.body });

    const agentsSelect = screen.getByLabelText('Agents');
    const formValues = formAPI.getState().values;
    expect(formValues.pmm_agent_id.value).toBe('pmm-server');
    expect(formValues.node.value).toBe('pmm-server');
  });

  it('should change the address to localhost when the agent id is not pmmServer', async () => {
    InventoryService.getNodes = () =>
      Promise.resolve({
        nodes: nodesMockMultipleAgentsNoPMMServer,
      });
    setup();
    await waitFor(() => {
      expect(fetchNodesActionActionSpy).toHaveBeenCalled();
    });
    const nodesSelect = screen.getByLabelText('Nodes');
    const agentsSelect = screen.getByLabelText('Agents');
    await selectEvent.select(nodesSelect, [nodesMockMultipleAgentsNoPMMServer[0].node_name], {
      container: document.body,
    });
    await selectEvent.select(agentsSelect, [nodesMockMultipleAgentsNoPMMServer[0].agents[0].agent_id], {
      container: document.body,
    });

    const formValues = formAPI.getState().values;
    expect(formValues.address).toBe('localhost');
  });

  it('should have the node/agent selected values when submit', async () => {
    InventoryService.getNodes = () =>
      Promise.resolve({
        nodes: nodesMock,
      });
    setup();
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
          value: 'pmm-server',
        }),
      }),
      expect.anything(),
      expect.anything()
    );
  });
});
