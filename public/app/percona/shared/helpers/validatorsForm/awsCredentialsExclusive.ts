import { Validator } from './validator.types';

// PMM assumes an IAM role from its own ambient credentials, never from a static key pair,
// so a role ARN and an access key / secret key are mutually exclusive. The server rejects
// both together with InvalidArgument; this surfaces the same rule before submit.
//
// It reads the sibling fields rather than its own value, so it can be attached to all three
// inputs and the message appears on whichever one the user is editing.
export const awsCredentialsExclusive: Validator = (_value, values = {}) => {
  const hasKeys = Boolean(values.aws_access_key || values.aws_secret_key);
  const hasRole = Boolean(values.aws_role_arn);

  return hasKeys && hasRole ? 'Use either an access key and secret key, or an IAM role ARN, not both' : undefined;
};
