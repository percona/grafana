import { Settings } from 'app/percona/settings/Settings.types';

export interface FeatureLoaderProps {
  featureName: string;
  featureFlag: keyof Settings;
  onError?: (error: any) => void;
}
