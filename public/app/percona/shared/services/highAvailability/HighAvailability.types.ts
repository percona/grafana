export type HAStatus = 'Enabled' | 'Disabled';

export enum NodeRole {
  leader = 'NODE_ROLE_LEADER',
  follower = 'NODE_ROLE_FOLLOWER',
  unspecified = 'NODE_ROLE_UNSPECIFIED',
}

export interface HighAvailabilityStatusResponse {
  status: HAStatus;
}

export interface HighAvailabilityNodesResponse {
  nodes: HighAvailabilityNode[];
}

export type NodeStatus = 'alive' | 'suspect' | 'dead' | 'left' | 'unknown';

export interface HighAvailabilityNode {
  node_name: string;
  role: NodeRole;
  status: NodeStatus;
}
