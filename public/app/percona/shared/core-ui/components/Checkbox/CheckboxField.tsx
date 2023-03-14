import React, { FC, useMemo } from 'react';
import { Field, UseFieldConfig, FieldMetaState, FieldInputProps } from 'react-final-form';

import { FieldInputAttrs, LabeledFieldProps } from '../../shared/types';
import { Validator, compose } from '../../shared/validators';

import { BaseCheckbox } from './Checkbox';

export interface CheckboxProps extends UseFieldConfig<boolean>, LabeledFieldProps {
  disabled?: boolean;
  fieldClassName?: string;
  inputProps?: FieldInputAttrs;
  validators?: Validator[];
  noError?: boolean;
}

interface CheckboxFieldRenderProps {
  input: FieldInputProps<string, HTMLInputElement>;
  meta: FieldMetaState<string>;
}

export const CheckboxField: FC<CheckboxProps> = React.memo(
  ({
    disabled,
    fieldClassName,
    inputProps,
    label,
    name,
    inputId,
    validators,
    tooltipText = '',
    tooltipLink,
    tooltipLinkText,
    tooltipIcon,
    tooltipDataTestId,
    tooltipLinkTarget,
    noError,
    ...fieldConfig
  }) => {
    const validate = useMemo(() => (Array.isArray(validators) ? compose(validators) : undefined), [validators]);

    return (
      <Field<boolean> {...fieldConfig} type="checkbox" name={name} validate={validate}>
        {({ input, meta }: CheckboxFieldRenderProps) => (
          <BaseCheckbox
            className={fieldClassName}
            disabled={disabled}
            inputId={inputId}
            {...input}
            {...inputProps}
            name={name}
            label={label}
            tooltipLink={tooltipLink}
            tooltipLinkText={tooltipLinkText}
            tooltipText={tooltipText}
            tooltipDataTestId={tooltipDataTestId}
            tooltipLinkTarget={tooltipLinkTarget}
            tooltipIcon={tooltipIcon}
            touched={meta.touched}
            error={meta.error}
            noError={noError}
          />
        )}
      </Field>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';
