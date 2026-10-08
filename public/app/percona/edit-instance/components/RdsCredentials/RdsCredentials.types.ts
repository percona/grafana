import { RdsAuthMode, RdsExporter } from '../../EditInstance.types';

export interface RdsCredentialsProps {
  exporter: RdsExporter;
  mode?: RdsAuthMode;
}
