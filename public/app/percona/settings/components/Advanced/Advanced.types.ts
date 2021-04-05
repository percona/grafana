import { LoadingCallback } from 'app/percona/settings/Settings.service';
import { SttCheckIntervalsSettings } from 'app/percona/settings/Settings.types';

export interface AdvancedFormValues {
  retention: string;
  telemetry: boolean;
  stt: boolean;
  publicAddress: string;
  alerting: boolean;
  azureDiscover: boolean;
  rareInterval: string;
  standardInterval: string;
  frequentInterval: string;
}

export interface AdvancedProps {
  dataRetention: string;
  telemetryEnabled: boolean;
  sttEnabled: boolean;
  updatesDisabled: boolean;
  dbaasEnabled?: boolean;
  alertingEnabled?: boolean;
  azureDiscoverEnabled?: boolean;
  publicAddress?: string;
  updateSettings: (body: any, callback: LoadingCallback, refresh?: boolean) => void;
  sttCheckIntervals: SttCheckIntervalsSettings;
}
