export interface EditInstanceRouteParams {
  serviceId: string;
}

export interface Instance {
  service_id: string;
  service_name: string;
  environment: string;
  cluster: string;
  replication_set: string;
  region: string;
  availability_zone: string;
  custom_labels: Record<string, string>;
}

export interface EditInstanceFormValues {
  environment: string;
  cluster: string;
  replication_set: string;
  region: string;
  availability_zone: string;
  custom_labels: string;
}
