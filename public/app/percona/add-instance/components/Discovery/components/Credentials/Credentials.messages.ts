export const Messages = {
  form: {
    fields: {
      awsAccessKey: {
        placeholder: 'Amazon RDS access key',
        name: 'aws_access_key',
        label: 'Amazon RDS access key',
      },
      awsSecretKey: {
        placeholder: 'Amazon RDS secret key',
        name: 'aws_secret_key',
        label: 'Amazon RDS secret key',
      },
      awsRoleArn: {
        placeholder: 'arn:aws:iam::123456789012:role/PmmRdsReadOnlyRole',
        name: 'aws_role_arn',
        label: 'AWS IAM role ARN',
        tooltipText: 'Optional. PMM Server assumes this role before discovering RDS instances.',
      },
    },
    submitButton: 'Discover',
    toMenuButton: 'Return to menu',
  },
};
