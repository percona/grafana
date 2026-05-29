import { Validator } from './validator.types';

export const disableCollectors: Validator<string | undefined> = (value) => {
  if (!value) {
    return undefined;
  }

  const tokens = value
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
  const validToken = /^[a-zA-Z0-9_.-]+$/;

  return tokens.every((token) => validToken.test(token))
    ? undefined
    : 'Each collector name may contain only letters, numbers, "_", ".", "-", separated by commas';
};
