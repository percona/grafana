export interface Backup {
  id: string;
  name: string;
  created: number;
  location: string;
}

export interface RawBackup {
  backup_id: string;
  name: string;
  location_name: string;
  created_at: string;
}
