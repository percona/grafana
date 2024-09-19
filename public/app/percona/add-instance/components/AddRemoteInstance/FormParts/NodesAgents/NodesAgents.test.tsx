//import { render, screen, waitFor } from '@testing-library/react';
//import React from 'react';
//import { Form } from 'react-final-form';
//import { Provider } from 'react-redux';
//import selectEvent from 'react-select-event';

//import { configureStore } from 'app/store/configureStore';

//import { NodesAgents } from './NodesAgents';
// import { nodesMockMultipleAgentsNoPMMServer, nodesMock } from 'app/percona/inventory/__mocks__/Inventory.service';
// import { fetchNodesAction } from 'app/percona/shared/core/reducers/nodes/nodes';
//import { FormApi } from 'final-form';

// const fetchNodesActionActionSpy = jest.mocked(fetchNodesAction);

jest.mock('app/percona/inventory/Inventory.service');

/*describe('Nodes Agents:: ', () => {

  let store = configureStore();
  let formAPI: FormApi<any>;
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
  );*/

/*  it('should pick the first agent when the selected node is not pmm-server', async () => {
    fetchNodesActionActionSpy.mockImplementation(nodesMockMultipleAgentsNoPMMServer);
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

  it('should pick the pmm-server from the list of agents when pmm-server node is choosen', async () => {
    fetchNodesActionActionSpy.mockImplementation(nodesMockMultipleAgentsNoPMMServer);
    await waitFor(() => {
      expect(fetchNodesActionActionSpy).toHaveBeenCalled();
    });
    const nodesSelect = screen.getByLabelText('Nodes');
    await selectEvent.select(nodesSelect, ['pmm-server'], { container: document.body });

    const agentsSelect = screen.getByLabelText('Agents');
    const formValues = formAPI.getState().values;
    expect(formValues.pmm_agent_id.value).toBe('pmm-agent');
    expect(formValues.node.value).toBe('pmm-server');
  });*/

//});
