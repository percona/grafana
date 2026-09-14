import { Validator } from './validator.types';

// Mirrors the server-side rule on aws_role_arn in api/management/v1/rds.proto and
// api/inventory/v1/agents.proto, so the UI rejects the same shapes the API would.
const awsRoleArnRe = /^arn:aws[a-zA-Z0-9-]*:iam::[0-9]{12}:role\/.+$/;

export const awsRoleArn: Validator<string | undefined> = (value) => {
  if (!value) {
    return undefined;
  }

  return awsRoleArnRe.test(value)
    ? undefined
    : 'Enter an IAM role ARN, for example arn:aws:iam::123456789012:role/RoleName';
};
