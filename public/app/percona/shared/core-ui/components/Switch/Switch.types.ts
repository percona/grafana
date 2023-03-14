import { FieldInputProps, FieldMetaState, UseFieldConfig } from 'react-final-form';

import { IconName } from '@grafana/ui';

import { FieldInputAttrs, LabeledFieldProps } from '../../shared/types';
import { Validator } from '../../shared/validators';

export interface SwitchFieldRenderProps {
  input: FieldInputProps<string, HTMLInputElement>;
  meta: FieldMetaState<string>;
}

export interface SwitchFieldProps extends UseFieldConfig<boolean>, LabeledFieldProps {
  disabled?: boolean;
  fieldClassName?: string;
  inputProps?: FieldInputAttrs;
  validators?: Validator[];
  tooltip?: string;
  tooltipIcon?: IconName;
}
