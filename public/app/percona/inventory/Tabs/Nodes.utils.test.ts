import { Node } from 'app/percona/inventory/Inventory.types';
import { ServiceStatus } from 'app/percona/shared/services/services/Services.types';

import { canRemoveNode } from './Nodes.utils';

const node = (overrides: Partial<Node>): Node => ({
  nodeId: 'node1',
  nodeType: 'container',
  nodeName: 'pmm-pmm-ha-client-0',
  address: '10.1.2.3',
  createdAt: '',
  updatedAt: '',
  status: ServiceStatus.UP,
  isPmmServerNode: false,
  ...overrides,
});

describe('canRemoveNode', () => {
  it('allows removing a regular node', () => {
    expect(canRemoveNode(node({}))).toBe(true);
  });

  it('disallows removing a PMM Server node', () => {
    expect(canRemoveNode(node({ isPmmServerNode: true }))).toBe(false);
  });

  it('disallows removing a protected node', () => {
    expect(canRemoveNode(node({ isPmmProtectedNode: true }))).toBe(false);
  });

  // A PMM Server without the flag reports nothing, and removal stays up to it.
  it('allows removing a node when the flag is missing', () => {
    expect(canRemoveNode(node({ isPmmProtectedNode: undefined }))).toBe(true);
  });
});
