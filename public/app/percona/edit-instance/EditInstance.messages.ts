export const Messages = {
  title: 'Inventory / Edit Service',
  cancel: 'Cancel',
  saveChanges: 'Save Changes',
  formTitle: (service: string) => `Editing “${service}” service`,
  success: {
    title: (service: string) => `Service “${service}” was changed`,
    description: 'It is now ready to continue monitoring.',
  },
  modal: {
    description:
      'Changing existing labels can affect other parts of PMM dependent on it, such as: alerting, data in dashboards, etc. ',
    details: 'Find more details about it in ',
    detailsLink: 'our documentation',
    dot: '.',
    confirm: 'Confirm and save changes',
    cancel: 'Cancel',
    cluster: {
      title: 'Cluster label changed',
      description:
        'Changing the cluster label will remove all scheduled backups for the impacted service/cluster. Make sure to recreate your backups after finishing the cluster configuration. For  more information, see ',
      descriptionLink: 'Editing Labels',
      dot: '.',
    },
    credentials: {
      title: 'AWS credentials changed',
      description:
        'The RDS exporter restarts to pick up the new credentials, so expect a short gap in CloudWatch metrics for this service.',
    },
    hostCredentials: {
      title: 'PMM will stop storing AWS credentials',
      description:
        'The exporter will fall back to whatever credentials the pmm-agent host provides. If that host has none, monitoring for this service stops.',
    },
  },
  partial: {
    title: 'AWS credentials were changed, labels were not',
    description: 'Review the error above and save the label changes again.',
  },
};
