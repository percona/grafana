export enum DumpStatus {
  BACKUP_STATUS_INVALID = 'BACKUP_STATUS_INVALID',
  BACKUP_STATUS_IN_PROGRESS = 'BACKUP_STATUS_IN_PROGRESS',
  BACKUP_STATUS_SUCCESS = 'BACKUP_STATUS_SUCCESS',
  BACKUP_STATUS_ERROR = 'BACKUP_STATUS_ERROR',
}

export const DumpStatusText = {
  [DumpStatus.BACKUP_STATUS_INVALID]: 'Invalid',
  [DumpStatus.BACKUP_STATUS_IN_PROGRESS]: 'Pending',
  [DumpStatus.BACKUP_STATUS_SUCCESS]: 'Success',
  [DumpStatus.BACKUP_STATUS_ERROR]: 'Error',
};

export interface PMMDumpServices {
  dump_id: string;
  status: DumpStatus;
  created_at: string;
  start_time: string;
  end_time: string;
  node_ids: string[];
  timeRange?: string;
}

export const DumpStatusColor = {
  [DumpStatus.BACKUP_STATUS_INVALID]: 'red',
  [DumpStatus.BACKUP_STATUS_IN_PROGRESS]: 'orange',
  [DumpStatus.BACKUP_STATUS_SUCCESS]: 'green',
  [DumpStatus.BACKUP_STATUS_ERROR]: 'red',
};

export interface SendToSupportForm {
  name: string;
  address: string;
  password: string;
}

export interface RawDumpLog {
  chunk_id: number;
  data: string;
  time: string;
}

export interface DumpLogResponse {
  logs: RawDumpLog[];
  end: boolean;
}

export interface DumpLogChunk extends Omit<RawDumpLog, 'chunk_id'> {
  id: number;
}

export interface DumpLogs {
  logs: DumpLogChunk[];
  end: boolean;
}