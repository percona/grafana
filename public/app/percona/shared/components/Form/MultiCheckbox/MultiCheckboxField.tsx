import React, { FC, ChangeEvent, FocusEvent, useState, useMemo, useCallback } from 'react';
import { Field, FieldInputProps } from 'react-final-form';
import { cx } from 'emotion';
import { useStyles } from '@grafana/ui';
import { CheckboxField, validators } from '@percona/platform-core';
import { getStyles } from './MultiCheckboxField.styles';
import { MultiCheckboxFieldProps, MultiCheckboxRenderProps } from './MultiCheckboxField.types';

const { compose } = validators;

export const MultiCheckboxField: FC<MultiCheckboxFieldProps> = React.memo(
  ({
    className,
    disabled = false,
    fieldClassName,
    label,
    name,
    required = false,
    showErrorOnBlur = false,
    initialOptions,
    validators,
    recommendedOption,
    recommendedLabel,
    ...fieldConfig
  }) => {
    const styles = useStyles(getStyles);
    const [selectedOptions, setSelectedOptions] = useState(initialOptions);
    const validate = useMemo(() => (Array.isArray(validators) ? compose(...validators) : undefined), [validators]);
    const onChangeOption = useCallback(
      (input: FieldInputProps<string, HTMLElement>) => ({ target }: ChangeEvent<HTMLInputElement>) => {
        const newSelectedOptions = selectedOptions.map(option =>
          option.name === target.name ? { ...option, value: target.checked } : option
        );

        input.onChange(newSelectedOptions);
        setSelectedOptions(newSelectedOptions);
      },
      [selectedOptions]
    );
    const onBlurOption = useCallback(
      (input: FieldInputProps<string, HTMLElement>) => (event: FocusEvent<HTMLElement>) => input.onBlur(event),
      []
    );

    return (
      <Field {...fieldConfig} name={name} initialValue={selectedOptions} validate={validate}>
        {({ input, meta }: MultiCheckboxRenderProps) => {
          const validationError = ((!showErrorOnBlur && meta.modified) || meta.touched) && meta.error;

          return (
            <div className={styles.field} data-qa={`${name}-field-container`}>
              {label && (
                <label className={styles.label} data-qa={`${name}-field-label`}>
                  {`${label}${required ? ' *' : ''}`}
                </label>
              )}
              <div
                className={cx(styles.getOptionsWrapperStyles(!!validationError), fieldClassName)}
                data-qa={`${name}-options`}
              >
                {selectedOptions.map(({ name, label, value }) => (
                  <div className={styles.optionWrapper} key={name} data-qa={`${name}-option`}>
                    <span className={styles.optionLabel}>{label}</span>
                    {recommendedOption?.name === name && (
                      <span className={styles.recommendedLabel}>{recommendedLabel}</span>
                    )}
                    <CheckboxField
                      name={name}
                      inputProps={{
                        checked: value,
                        onChange: onChangeOption(input),
                        onBlur: onBlurOption(input),
                      }}
                    />
                  </div>
                ))}
              </div>
              <div data-qa={`${name}-field-error-message`} className={styles.errorMessage}>
                {validationError}
              </div>
            </div>
          );
        }}
      </Field>
    );
  }
);

MultiCheckboxField.displayName = 'MultiCheckboxField';
