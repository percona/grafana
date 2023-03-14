import { cx } from '@emotion/css';
import React, { FC, useMemo, useRef, useState, ChangeEvent } from 'react';
import { Field, FieldMetaState, FieldInputProps, UseFieldConfig } from 'react-final-form';

import { useStyles2 } from '@grafana/ui';

import { FieldInputAttrs, LabeledFieldProps } from '../../shared/types';
import { Validator, compose } from '../../shared/validators';
import { Chip } from '../Chip';
import { Label } from '../Label';

import { getStyles } from './ChipAreaInputField.styles';

/**
 * Note: the validation error message will be displayed once the the input has been modified.
 * To show the error message on blur you have to pass `showErrorOnBlur`.
 */
export interface ChipAreaInputFieldProps extends UseFieldConfig<string>, LabeledFieldProps {
  className?: string;
  disabled?: boolean;
  fieldClassName?: string;
  inputProps?: FieldInputAttrs;
  placeholder?: string;
  showErrorOnBlur?: boolean;
  showErrorOnRender?: boolean;
  validators?: Validator[];
  initialChips?: string[];
}

interface ChipAreaInputFieldRenderProps {
  input: FieldInputProps<string>;
  meta: FieldMetaState<string>;
}

export const ChipAreaInputField: FC<ChipAreaInputFieldProps> = React.memo(
  ({
    className,
    disabled = false,
    fieldClassName,
    inputProps,
    label,
    name,
    inputId = `input-${name}-id`,
    placeholder,
    required = false,
    showErrorOnBlur = false,
    showErrorOnRender = false,
    validators,
    tooltipText = '',
    tooltipLink,
    tooltipLinkText,
    tooltipIcon,
    tooltipDataTestId,
    tooltipLinkTarget,
    initialChips = [],
    ...fieldConfig
  }) => {
    const styles = useStyles2(getStyles);
    const [chips, setChips] = useState([...initialChips]);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const validate = useMemo(() => (Array.isArray(validators) ? compose(validators) : undefined), [validators]);

    const handleClick = () => {
      inputRef.current?.focus();
    };

    const handleKeyDown = (
      input: FieldInputProps<string, HTMLInputElement>,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (inputValue) {
        if (e.key === 'Enter' && inputRef.current) {
          const { value } = inputRef.current;
          const sameValue = chips.find((c) => c === value);

          if (!sameValue) {
            const newChips = [...chips, inputRef.current.value];

            setChips(newChips);
            input.onChange(newChips);
          }

          setInputValue('');
        }
      } else if (e.key === 'Backspace' && chips.length) {
        const newChips = chips.slice(0, chips.length - 1);

        setChips(newChips);
        input.onChange(newChips);
      }
    };

    const handleOuterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleChipRemove = (input: FieldInputProps<string, HTMLInputElement>, text: string) => {
      const newChips = chips.filter((c) => c !== text);

      setChips(newChips);
      input.onChange(newChips);
    };

    return (
      <Field {...fieldConfig} type="text" name={name} validate={validate}>
        {({ input, meta }: ChipAreaInputFieldRenderProps) => {
          const validationError =
            (((!showErrorOnBlur && meta.modified) || meta.touched) && meta.error) || (showErrorOnRender && meta.error);

          return (
            <div
              className={cx(styles.field, fieldClassName)}
              data-testid={`${name}-field-container`}
              onKeyDown={handleOuterKeyDown}
            >
              <Label
                name={name}
                label={label}
                required={required}
                inputId={inputId}
                tooltipLink={tooltipLink}
                tooltipLinkText={tooltipLinkText}
                tooltipText={tooltipText}
                tooltipDataTestId={tooltipDataTestId}
                tooltipLinkTarget={tooltipLinkTarget}
                tooltipIcon={tooltipIcon}
              />
              <div className={styles.chips}>
                <div data-testid="chips-container" className={styles.chipsInnerWrapper} onClick={handleClick}>
                  {chips.map((chip) => (
                    <Chip
                      key={chip}
                      isRemovable
                      text={chip}
                      className={styles.chip}
                      onRemove={(text) => handleChipRemove(input, text)}
                    />
                  ))}
                  <input
                    ref={inputRef}
                    id={inputId}
                    {...input}
                    {...inputProps}
                    value={inputValue}
                    onKeyDown={(e) => handleKeyDown(input, e)}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    data-testid={`${name}-text-input`}
                    className={cx(styles.input, { invalid: !!validationError }, className)}
                  />
                </div>
              </div>
              <div data-testid={`${name}-field-error-message`} className={styles.errorMessage}>
                {validationError}
              </div>
            </div>
          );
        }}
      </Field>
    );
  }
);

ChipAreaInputField.displayName = 'ChipAreaInputField';
