import { HighAvailabilityService } from '../HighAvailability.service';
import { HighAvailabilityNodesResponse, HighAvailabilityStatusResponse, NodeRole } from '../HighAvailability.types';

export const HA_STATUS_MOCK: HighAvailabilityStatusResponse = {
  status: 'Enabled',
};

export const HA_NODES_MOCK_HEALTHY: HighAvailabilityNodesResponse = {
  nodes: [
    {
      node_name: 'pmm-server',
      role: NodeRole.follower,
      status: 'alive',
    },
    {
      node_name: 'mysql',
      role: NodeRole.leader,
      status: 'alive',
    },
    {
      node_name: 'mongodb',
      role: NodeRole.follower,
      status: 'alive',
    },
  ],
};

export const HA_NODES_MOCK_DEGRADED: HighAvailabilityNodesResponse = {
  nodes: [
    {
      node_name: 'pmm-ha-0',
      role: NodeRole.follower,
      status: 'alive',
    },
    {
      node_name: 'pmm-ha-1',
      role: NodeRole.leader,
      status: 'alive',
    },
    {
      node_name: 'pmm-ha-2',
      role: NodeRole.follower,
      status: 'dead',
    },
  ],
};

export const HA_NODES_MOCK_CRITICAL: HighAvailabilityNodesResponse = {
  nodes: [
    {
      node_name: 'pmm-ha-0',
      role: NodeRole.follower,
      status: 'dead',
    },
    {
      node_name: 'pmm-ha-1',
      role: NodeRole.leader,
      status: 'alive',
    },
    {
      node_name: 'pmm-ha-2',
      role: NodeRole.follower,
      status: 'dead',
    },
  ],
};

export const HA_NODES_MOCK_DOWN: HighAvailabilityNodesResponse = {
  nodes: [
    {
      node_name: 'pmm-ha-0',
      role: NodeRole.follower,
      status: 'suspect',
    },
    {
      node_name: 'pmm-ha-1',
      role: NodeRole.leader,
      status: 'suspect',
    },
    {
      node_name: 'pmm-ha-2',
      role: NodeRole.follower,
      status: 'suspect',
    },
  ],
};

export const HighAvailabilityServiceMock =
  jest.genMockFromModule<typeof HighAvailabilityService>('../HighAvailability.service');

HighAvailabilityServiceMock.getStatus = () => Promise.resolve(HA_STATUS_MOCK);

HighAvailabilityServiceMock.getNodes = () => Promise.resolve(HA_NODES_MOCK_HEALTHY);

export default HighAvailabilityServiceMock;
