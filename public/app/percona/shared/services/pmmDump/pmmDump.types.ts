export interface PmmDumpResponse {
  dumps: PmmDump[];
}

export interface PmmDump {
  dump_id: string;
  status: string;
  node_ids: string[];
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface DeleteDump {
  dump_id: string;
}
