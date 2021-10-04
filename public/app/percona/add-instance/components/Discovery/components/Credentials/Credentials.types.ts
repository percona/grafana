import { InstanceAvailableType } from '../../../../panel.types';

export interface CredentialsForm {
  aws_access_key: string;
  aws_secret_key: string;
}

export interface CredentialsProps {
  discover: (credentials: CredentialsForm) => void;
  selectInstance: React.Dispatch<React.SetStateAction<InstanceAvailableType>>;
}
