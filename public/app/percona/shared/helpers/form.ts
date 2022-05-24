import { SelectableValue } from '@grafana/data';
import { FormEvent } from 'react';

// Percona's RadiouGroup doesn't allow us to trivially intercept onChange
// Use this the following way:
// <RadioButtonGroupField inputProps={{ onInput: onStatusChanged }} />
// and call getChosenRadioOption(e, options) to get the chosen SelectableValue
export const getChosenRadioOption = <T>(
  e: FormEvent<HTMLInputElement>,
  options: Array<SelectableValue<T>>
): SelectableValue<T> | null => {
  const target = e.target as HTMLInputElement;

  if (target.labels && target.labels.length) {
    const label = target.labels[0].textContent;
    const selectedOption = options.find((opt) => opt.label === label);

    if (selectedOption) {
      return selectedOption;
    }

    return null;
  }

  return null;
};
