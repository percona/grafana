/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CancelToken } from 'axios';

import { InventoryService, NodeFe, NodeFromDb, RemoveNodeBody } from 'app/percona/inventory/Inventory.service';
import { filterFulfilled, processPromiseResults } from 'app/percona/shared/helpers/promises';

import { NodesState, RemoveNodesParams } from './nodes.types';

const initialState: NodesState = {
  nodes: [],
  isLoading: false,
};

const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNodesAction.pending, (state) => ({
      ...state,
      isLoading: true,
    }));
    builder.addCase(fetchNodesAction.rejected, (state) => ({
      ...state,
      isLoading: false,
    }));
    builder.addCase(fetchNodesAction.fulfilled, (state, action) => ({
      ...state,
      nodes: action.payload,
      isLoading: false,
    }));
  },
});

const nodeFromDbMapper = (nodeFromDb: NodeFromDb[]) => {
  return nodeFromDb.map(
    (node) =>
      ({
        nodeId: node.node_id,
        nodeType: node.node_type,
        nodeName: node.node_name,
        machineId: node.machine_id,
        distro: node.distro,
        address: node.address,
        nodeModel: node.node_model,
        region: node.region,
        az: node.az,
        containerId: node.container_id,
        containerName: node.container_name,
        customLabels: node.custom_labels,
        agents: node.agents?.map((agent) => ({
          agentId: agent.agent_id,
          agentType: agent.agent_type,
          status: agent.status,
          isConnected: agent.is_connected,
        })),
        createdAt: node.created_at,
        updatedAt: node.updated_at,
        status: node.status,
        services: node.services,
      } as NodeFe)
  );
};

export const fetchNodesAction = createAsyncThunk<NodeFe[], { token?: CancelToken }>(
  'percona/fetchNodes',
  async (params = {}) => {
    const { nodes } = await InventoryService.getNodes(params.token);
    console.log(nodes);
    //return toDbNodesModel(nodes);
    return nodeFromDbMapper(nodes);
  }
);

export const removeNodesAction = createAsyncThunk(
  'percona/removeNodes',
  async (params: RemoveNodesParams): Promise<number> => {
    const bodies: RemoveNodeBody[] = params.nodes.map(({ nodeId, force }) => ({ node_id: nodeId, force }));
    const requests = bodies.map((body) => InventoryService.removeNode(body, params.cancelToken));
    const results = await processPromiseResults(requests);
    return results.filter(filterFulfilled).length;
  }
);

export default nodesSlice.reducer;
