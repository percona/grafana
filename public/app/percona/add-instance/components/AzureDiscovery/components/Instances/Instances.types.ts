import { Instance } from '../../Discovery.types';
import { AvailableTypes } from '../../../../panel.types';
import { AzureCredentialsForm } from '../Credentials/Credentials.types';

export type AzureCredentials = AzureCredentialsForm & {
  isAzure?: boolean;
};

export type OnSelectInstance = ({
  type,
  credentials,
}: {
  type: AvailableTypes | '';
  credentials: AzureCredentials;
}) => void;

export interface InstancesTableProps {
  instances: Instance[];
  selectInstance: OnSelectInstance;
  loading: boolean;
  credentials: AzureCredentialsForm;
}
