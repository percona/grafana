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
        placeholder: 'arn:aws:iam::123456789012:role/PmmRdsMonitoring',
        name: 'aws_role_arn',
        label: 'AWS IAM role ARN',
        tooltipText:
          'PMM Server assumes this role using its own AWS identity to discover RDS instances. ' +
          'Use it instead of an access key and secret key, not together with them.',
      },
    },
    submitButton: 'Discover',
    toMenuButton: 'Return to menu',
  },
};
