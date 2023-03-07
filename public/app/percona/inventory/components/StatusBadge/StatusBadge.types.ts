import { ServiceAgent } from '../../Inventory.types';

export interface StatusBadgeProps {
  agents: Array<Pick<ServiceAgent, 'status'>>;
  strippedServiceId: string;
}
