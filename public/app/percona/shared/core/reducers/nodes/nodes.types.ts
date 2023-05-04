import { CancelToken } from 'axios';

import { NodeFe } from 'app/percona/inventory/Inventory.types';

export interface NodesState {
  nodes: NodeFe[];
  isLoading: boolean;
}

export interface RemoveNodeParams {
  nodeId: string;
  force: boolean;
}

export interface RemoveNodesParams {
  nodes: RemoveNodeParams[];
  cancelToken?: CancelToken;
}
