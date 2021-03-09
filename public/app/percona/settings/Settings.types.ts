export interface EmailSettings {
  from?: string;
  smarthost?: string;
  hello?: string;
  username?: string;
  password?: string;
  identity?: string;
  secret?: string;
}

export interface SlackSettings {
  url?: string;
}

export interface AlertingSettings {
  email: EmailSettings;
  slack: SlackSettings;
}

export enum SttCheckIntervals {
  rareInterval = 'rareInterval',
  standardInterval = 'standardInterval',
  frequentInterval = 'frequentInterval',
}

export interface SttCheckIntervalsSettings {
  [SttCheckIntervals.rareInterval]: string;
  [SttCheckIntervals.standardInterval]: string;
  [SttCheckIntervals.frequentInterval]: string;
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
  sttCheckIntervals: SttCheckIntervalsSettings;
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
