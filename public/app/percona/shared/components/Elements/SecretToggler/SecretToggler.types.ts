import { TextInputFieldProps } from 'app/percona/shared/core-ui';

export interface SecretTogglerProps {
  secret?: string;
  readOnly?: boolean;
  small?: boolean;
  maxLength?: number;
  fieldProps?: TextInputFieldProps;
}
