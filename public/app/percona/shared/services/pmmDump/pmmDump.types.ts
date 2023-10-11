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

export interface Node {
  node_id: string;
  node_name: string;
  address: string;
  machine_id?: string;
  distro?: string;
  node_model: string;
  region: string;
  az: string;
  custom_labels: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
}

export interface NodeTypes {
  generic: Node;
  container: Node;
  remote: Node;
  remote_rds: Node;
  remote_azure_database: Node;
}
