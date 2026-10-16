export interface EditInstanceRouteParams {
  serviceId: string;
}

// How the service's rds_exporter authenticates to AWS. The three are mutually exclusive on the
// server, so the form models them as one choice rather than leaving the user to clear fields.
export enum RdsAuthMode {
  accessKey = 'access_key',
  iamRole = 'iam_role',
  hostCredentials = 'host_credentials',
}

// The rds_exporter monitoring the node this service sits on, as far as the form cares about it.
// The secret key is never returned by the API, so only its presence is known.
export interface RdsExporter {
  agentId: string;
  awsAccessKey: string;
  awsRoleArn: string;
  isAwsSecretKeySet: boolean;
}

export interface EditInstanceFormValues {
  environment?: string;
  cluster?: string;
  replication_set?: string;
  custom_labels?: string;
  rds_auth_mode?: RdsAuthMode;
  aws_access_key?: string;
  aws_secret_key?: string;
  aws_role_arn?: string;
}
