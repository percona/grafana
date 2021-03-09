import { LoadingCallback } from 'app/percona/settings/Settings.service';
import { SttCheckIntervalsSettings } from 'app/percona/settings/Settings.types';

export interface AdvancedProps {
  dataRetention: string;
  telemetryEnabled: boolean;
  sttEnabled: boolean;
  updatesDisabled: boolean;
  dbaasEnabled?: boolean;
  alertingEnabled?: boolean;
  publicAddress?: string;
  updateSettings: (body: any, callback: LoadingCallback, refresh?: boolean) => void;
  sttCheckIntervals: SttCheckIntervalsSettings;
}
