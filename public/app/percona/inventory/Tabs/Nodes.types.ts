import { Node } from 'app/percona/inventory/Inventory.types';
import { NodeRole, NodeStatus } from 'app/percona/shared/services/highAvailability/HighAvailability.types';

export interface InventoryNode extends Node {
  haRole?: NodeRole;
  haStatus?: NodeStatus;
}
