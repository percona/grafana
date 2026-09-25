import { Validator } from 'app/percona/shared/helpers/validatorsForm';

/**
 * A stored secret key belongs to the stored access key. Keeping it while the access key changes
 * would leave the exporter with a mismatched pair that fails silently against CloudWatch, so the
 * secret is only optional while the access key is untouched.
 */
export const requiredAwsSecretKey =
  (storedAccessKey: string, isStoredSecretKeySet: boolean): Validator<string | undefined> =>
  (value, values = {}) => {
    if (value) {
      return undefined;
    }

    return isStoredSecretKeySet && values.aws_access_key === storedAccessKey
      ? undefined
      : 'Enter the secret key that goes with this access key';
  };
