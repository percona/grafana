import { ServiceAgent } from '../../Inventory.types';

export interface StatusBadgeProps {
  agents: Array<Pick<ServiceAgent, 'agentId' | 'status'>>;
  full?: boolean;
}
