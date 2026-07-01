import { Validator } from './validator.types';

const collectorNameRe = /^[a-zA-Z0-9_.-]+$/;

export const disableCollectors: Validator<string | undefined> = (value) => {
  if (!value) {
    return undefined;
  }

  const tokens = value
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);

  return tokens.every((token) => collectorNameRe.test(token))
    ? undefined
    : 'Each collector name may contain only letters, numbers, "_", ".", "-", separated by commas';
};
