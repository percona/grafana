export const Messages = {
  sectionTitle: 'Amazon RDS credentials',
  description:
    'Choose how the RDS exporter authenticates to AWS for this service. Saving restarts the exporter, so expect a short gap in CloudWatch metrics.',
  authMode: {
    label: 'Authenticate with',
    tooltipText:
      'An access key, an IAM role assumed from the AWS identity of the pmm-agent host, or whatever credentials that host already provides. These are mutually exclusive.',
    options: {
      accessKey: 'Access key',
      iamRole: 'IAM role',
      hostCredentials: 'Host credentials',
    },
  },
  fields: {
    awsAccessKey: {
      label: 'Amazon RDS access key',
      placeholder: 'Amazon RDS access key',
    },
    awsSecretKey: {
      label: 'Amazon RDS secret key',
      placeholder: 'Amazon RDS secret key',
      storedPlaceholder: 'Leave blank to keep the current secret key',
    },
    awsRoleArn: {
      label: 'AWS IAM role ARN',
      placeholder: 'arn:aws:iam::123456789012:role/PmmRdsMonitoring',
      tooltipText:
        'The pmm-agent host running this exporter assumes this role using its own AWS identity. PMM stores no access key for it.',
    },
  },
  hostCredentials:
    'PMM will store no AWS credentials for this service. The exporter uses whatever the pmm-agent host provides - an instance profile, environment variables, or a credentials file. Monitoring stops if that host has none.',
};
