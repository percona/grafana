export const GUI_DOC_URL =
  'https://www.percona.com/doc/percona-monitoring-and-management/2.x/manage/server-admin-gui.html';
export const DATA_RETENTION_URL =
  'https://www.percona.com/doc/percona-monitoring-and-management/2.x/faq.html#how-to-control-data-retention-for-pmm';
export const HOW_TO_DOC_URL = 'https://www.percona.com/doc/percona-monitoring-and-management/2.x/how-to';

export const Messages = {
  advanced: {
    action: 'Apply changes',
    retentionLabel: 'Data retention',
    retentionTooltip: 'This is the value for how long data will be stored.',
    retentionUnits: 'days',
    telemetryLabel: 'Telemetry',
    telemetryLink: `${GUI_DOC_URL}#server-admin-gui-telemetry`,
    telemetryTooltip: 'Option to send usage data back to Percona to let us make our product better.',
    updatesLabel: 'Check for updates',
    updatesLink: `${GUI_DOC_URL}#check-for-updates`,
    updatesTooltip: 'Option to check new versions and ability to update PMM from UI.',
    sttLabel: 'Security Threat Tool',
    sttRareIntervalLabel: 'Rare interval',
    sttStandardIntervalLabel: 'Standard interval',
    sttFrequentIntervalLabel: 'Frequent interval',
    sttCheckIntervalsLabel: 'Execution Intervals',
    sttCheckIntervalTooltip: 'Interval between check runs',
    sttCheckIntervalUnit: 'hours',
    sttLink: `${GUI_DOC_URL}#security-threat-tool`,
    sttTooltip: 'Enable Security Threat Tool and get updated checks from Percona.',
    dbaasLabel: 'DBaaS',
    azureDiscoverLabel: 'Microsoft Azure monitoring',
    azureDiscoverTooltip: 'Option to enable/disable Microsoft Azure DB instanced  discovery and monitoring',
    azureDiscoverLink: `${HOW_TO_DOC_URL}/configure.html#microsoft-azure-feature-toggle`,
    dbaasTooltip:
      'Option to enable/disable DBaaS features. Disabling DBaaS does not suspend or remove running clusters.',
    dbaasLink: `${HOW_TO_DOC_URL}/configure.html#dbaas`,
    publicAddressLabel: 'Public Address',
    publicAddressTooltip: 'Public Address to this PMM server.',
    publicAddressButton: 'Get from browser',
    alertingLabel: 'Integrated Alerting',
    alertingTooltip: 'Option to enable/disable Integrated Alerting features.',
    alertingLink: `${HOW_TO_DOC_URL}/configure.html#integrated-alerting`,
    backupLabel: 'Backup Management',
    backupTooltip: 'Option to enable/disable Backup Management features.',
    backupLink: `${HOW_TO_DOC_URL}/configure.html#backup-management`,
    technicalPreviewLegend: 'Technical preview features',
    technicalPreviewDescription:
      'These are technical preview features, not recommended to be used in production environments. Read more\n' +
      '                  about feature status',
    technicalPreviewLinkText: 'here',
  },
  alertmanager: {
    action: 'Apply Alertmanager settings',
    rulesLabel: 'Prometheus Alerting rules',
    rulesLink: `${GUI_DOC_URL}#prometheus-alertmanager-integration`,
    rulesTooltip: 'Alerting rules in the YAML configuration format.',
    urlLabel: 'Alertmanager URL',
    urlLink: `${GUI_DOC_URL}#prometheus-alertmanager-integration`,
    urlTooltip: 'The URL of the external Alertmanager to use.',
  },
  diagnostics: {
    action: 'Download server diagnostics',
    label: 'Diagnostics',
    tooltip:
      'You can download server logs to make the problem detection simpler. Please include this file if you are submitting a bug report.',
  },
  metrics: {
    action: 'Apply changes',
    label: 'Metrics resolution, sec',
    link: `${GUI_DOC_URL}#server-admin-gui-metrics-resolution`,
    options: {
      rare: 'Rare',
      standard: 'Standard',
      frequent: 'Frequent',
      custom: 'Custom',
    },
    intervals: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    },
    tooltip: 'This setting defines how frequently the data will be collected.',
  },
  ssh: {
    action: 'Apply SSH key',
    label: 'SSH key',
    link: `${GUI_DOC_URL}#ssh-key-details`,
    tooltip: 'Public SSH key to let you login into the server using SSH.',
  },
  service: {
    success: 'Settings updated',
  },
  tabs: {
    metrics: 'Metrics Resolution',
    advanced: 'Advanced Settings',
    ssh: 'SSH Key',
    alertManager: 'Alertmanager Integration',
    perconaPlatform: 'Percona Platform',
    communication: 'Communication',
  },
  tooltipLinkText: 'Read more',
  unauthorized: 'Insufficient access permissions.',
};
