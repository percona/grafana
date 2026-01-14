import { HighAvailabilityNode, NodeRole } from 'app/percona/shared/services/highAvailability/HighAvailability.types';
import { Node } from 'app/percona/inventory/Inventory.types';
import { InventoryNode } from './Nodes.types';

export const getServiceLink = (serviceId: string) => {
  return `/inventory/services?search-text-input=${serviceId}&search-select=serviceId`;
};

export const mapNodesToInventoryNodes = (nodes: Node[], haNodes: HighAvailabilityNode[]): InventoryNode[] =>
  nodes.map((node) => {
    const haNode = haNodes.find((haNode) => haNode.node_name === node.nodeName);

    return {
      ...node,
      haRole: haNode?.role,
      haStatus: haNode?.status,
    };
  });

export const getHaRoleBadgeText = (role: NodeRole) => {
  switch (role) {
    case NodeRole.leader:
      return 'Leader';
    case NodeRole.follower:
      return 'Follower';
    default:
      return 'Unspecified';
  }
};
