import { PmmDump } from 'app/percona/shared/services/pmmDump/pmmDump.types';

export interface PmmDumpState {
  isLoading: boolean;
  dumps: PmmDump[];
}
