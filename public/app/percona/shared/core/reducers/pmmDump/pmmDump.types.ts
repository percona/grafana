import { DumpStatus, PMMDumpServices } from 'app/percona/pmm-dump/PmmDump.types';

export interface PmmDumpState {
  isLoading: boolean;
  dumps: PMMDumpServices[];
}

export interface PmmDump {
  dump_id: string;
  status: DumpStatus;
  service_names: string[];
  start_time: string;
  end_time: string;
  created_at: string;
}
