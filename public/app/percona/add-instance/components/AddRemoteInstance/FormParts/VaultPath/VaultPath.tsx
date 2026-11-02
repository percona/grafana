import { FC } from 'react';

import { TextInputField } from 'app/percona/shared/components/Form/TextInput';
import { Validator, validators } from 'app/percona/shared/helpers/validatorsForm';

import { Messages } from '../FormParts.messages';

/**
 * Refuses what PMM Server refuses as the path of a Vault secret: whitespace, '?', '#', and empty or
 * relative segments.
 */
export const validateVaultPath: Validator<string> = (value) => {
  if (!value) {
    return undefined;
  }

  const path = value.replace(/^\/+|\/+$/g, '');
  if (/[\s?#]/.test(path) || path.split('/').some((segment) => ['', '.', '..'].includes(segment))) {
    return Messages.form.validation.vaultPath;
  }

  return undefined;
};

/**
 * Makes a credential required unless the service reads its credentials from Vault, where the secret
 * holds them.
 */
export const requiredUnlessVaultPath: Validator = (value, values) =>
  values?.vault_path ? undefined : validators.required(value);

const vaultPathValidators = [validateVaultPath];

export const VaultPathField: FC = () => (
  <TextInputField
    name="vault_path"
    label={Messages.form.labels.mainDetails.vaultPath}
    tooltipText={Messages.form.tooltips.mainDetails.vaultPath}
    placeholder={Messages.form.placeholders.mainDetails.vaultPath}
    validators={vaultPathValidators}
  />
);
