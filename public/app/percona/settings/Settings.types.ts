export interface EmailSettings {
  from: string;
  smarthost: string;
  hello: string;
  username?: string;
  password?: string;
  secret?: string;
  identity?: string;
}

export interface SlackSettings {
  url?: string;
}

export interface AlertingSettings {
  email: EmailSettings;
  slack: SlackSettings;
}

export interface SettingsAPI {
  aws_partitions: string[];
  updates_disabled: boolean;
  telemetry_enabled: boolean;
  metrics_resolutions: MetricsResolutions;
  data_retention: string;
  ssh_key: string;
  alert_manager_url: string;
  alert_manager_rules: string;
  stt_enabled: boolean;
  platform_email: string;
  dbaas_enabled: boolean;
  alerting_enabled: boolean;
  email_alerting_settings: EmailSettings;
  slack_alerting_settings: SlackSettings;
  pmm_public_address: string;
}

export interface Settings {
  updatesDisabled: boolean;
  telemetryEnabled: boolean;
  metricsResolutions: MetricsResolutions;
  dataRetention: string;
  sshKey: string;
  awsPartitions: string[];
  alertManagerUrl: string;
  alertManagerRules: string;
  sttEnabled: boolean;
  platformEmail?: string;
  dbaasEnabled?: boolean;
  alertingEnabled?: boolean;
  publicAddress?: string;
  alertingSettings: AlertingSettings;
}

export interface MetricsResolutions {
  hr: string;
  mr: string;
  lr: string;
}

export enum TabKeys {
  metrics = 'metrics-resolution',
  advanced = 'advanced-settings',
  ssh = 'ssh-key',
  alertManager = 'am-integration',
  perconaPlatform = 'percona-platform',
  communication = 'communication',
}

export enum EmailAuthType {
  NONE = 'NONE',
  PLAIN = 'PLAIN',
  LOGIN = 'LOGIN',
  CRAM = 'CRAM-MD5',
}
