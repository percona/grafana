import { Instance } from '../../Discovery.types';
import { SelectInstance } from '../../../../panel.types';
import { RDSCredentialsForm } from '../Credentials/Credentials.types';

export type RDSCredentials = RDSCredentialsForm & {
  isRDS?: boolean;
};

export interface InstancesTableProps {
  instances: Instance[];
  selectInstance: SelectInstance;
  loading: boolean;
  credentials: RDSCredentialsForm;
}
