import { Messages as DiscoveryMessages } from 'app/percona/add-instance/components/Discovery/components/Credentials/Credentials.messages';

const { awsAccessKey, awsSecretKey, awsRoleArn } = DiscoveryMessages.form.fields;

// Field labels and placeholders are shared with the discovery form so the same credential is not
// called two different things in two places. The tooltips are not shared: on discovery the
// identity is PMM Server's and the action is listing instances, while here it is the pmm-agent
// host's and the action is scraping CloudWatch.
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
      label: awsAccessKey.label,
      placeholder: awsAccessKey.placeholder,
    },
    awsSecretKey: {
      label: awsSecretKey.label,
      placeholder: awsSecretKey.placeholder,
      storedPlaceholder: 'Leave blank to keep the current secret key',
    },
    awsRoleArn: {
      label: awsRoleArn.label,
      placeholder: awsRoleArn.placeholder,
      tooltipText:
        'The pmm-agent host running this exporter assumes this role using its own AWS identity. PMM stores no access key for it.',
    },
  },
  hostCredentials:
    'PMM will store no AWS credentials for this service. The exporter uses whatever the pmm-agent host provides - an instance profile, environment variables, or a credentials file. Monitoring stops if that host has none.',
};
