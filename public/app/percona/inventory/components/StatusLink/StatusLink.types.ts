import { DbAgent } from 'app/percona/shared/services/services/Services.types';

export interface StatusLinkProps {
  agents: DbAgent[];
  strippedServiceId: string;
}
