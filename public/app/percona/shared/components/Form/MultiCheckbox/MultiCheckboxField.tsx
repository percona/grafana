import React, { FC, ChangeEvent, FocusEvent, useState, useMemo, useCallback } from 'react';
import { Field, FieldInputProps } from 'react-final-form';
import { cx } from 'emotion';
import { useStyles } from '@grafana/ui';
import { CheckboxField, validators } from '@percona/platform-core';
import { getStyles } from './MultiCheckboxField.styles';
import { formatOptions } from './MultiCheckboxField.utils';
import { NAME_PREFIX } from './MultiCheckboxField.constants';
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
    const [selectedOptions, setSelectedOptions] = useState(formatOptions(initialOptions));
    const validate = useMemo(() => (Array.isArray(validators) ? compose(...validators) : undefined), [validators]);
    const onChangeOption = useCallback(
      (input: FieldInputProps<string, HTMLElement>) => ({ target }: ChangeEvent<HTMLInputElement>) => {
        const name = target.name.replace(NAME_PREFIX, '');
        const newSelectedOptions = { ...selectedOptions, [name]: target.checked };

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
                {Object.entries(selectedOptions).map(([label, value]) => (
                  <div className={styles.optionWrapper} key={label} data-qa={`${label}-option`}>
                    <span className={styles.optionLabel}>{label}</span>
                    {recommendedOption?.label === label && (
                      <span className={styles.recommendedLabel}>{recommendedLabel}</span>
                    )}
                    <CheckboxField
                      name={`${label}${NAME_PREFIX}`}
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
