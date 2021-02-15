import { TextInputFieldProps } from '@percona/platform-core';

export interface SecretTogglerProps {
  secret?: string;
  readOnly?: boolean;
  minified?: boolean;
  fieldProps?: TextInputFieldProps;
}
