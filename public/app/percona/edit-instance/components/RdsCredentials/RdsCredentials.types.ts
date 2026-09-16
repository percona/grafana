import { RdsAuthMode, RdsExporter } from '../../EditInstance.types';

export interface RdsCredentialsProps {
  exporter: RdsExporter;
  // Current value of the rds_auth_mode field, passed down from the form's render props so the
  // section can show only the inputs that the selected mode actually uses.
  mode?: RdsAuthMode;
}
