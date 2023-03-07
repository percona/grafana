import { ServiceAgent } from '../../Inventory.types';

export interface StatusLinkProps {
  agents: Array<Pick<ServiceAgent, 'status'>>;
  strippedServiceId: string;
}
