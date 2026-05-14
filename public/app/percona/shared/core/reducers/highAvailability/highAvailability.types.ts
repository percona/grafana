import { HighAvailabilityNode } from 'app/percona/shared/services/highAvailability/HighAvailability.types';

export interface HighAvailabilityState {
  isLoading: boolean;
  isEnabled: boolean;
  nodes: HighAvailabilityNode[];
}
