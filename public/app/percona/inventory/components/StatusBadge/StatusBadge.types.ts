import { DbServiceAgent } from 'app/percona/shared/services/services/Services.types';

export interface StatusBadgeProps {
  agents: DbServiceAgent[];
  strippedId: string;
  type: 'services' | 'nodes';
}
