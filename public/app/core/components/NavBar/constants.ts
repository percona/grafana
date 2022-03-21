import { NavModelItem } from '@grafana/data';
import { getConfig } from 'app/core/config';

export const PMM_STT_PAGE: NavModelItem = {
  id: 'database-checks',
  icon: 'percona-database-checks',
  text: 'Security Checks',
  subTitle: 'Percona Security Checks',
  url: `${getConfig().appSubUrl}/pmm-database-checks`,
  breadcrumbs: [
    {
      title: 'Security Checks',
      url: `${getConfig().appSubUrl}/pmm-database-checks`,
    },
  ],
  children: [
    {
      id: 'failed-checks',
      text: 'Failed Checks',
      url: `${getConfig().appSubUrl}/pmm-database-checks/failed-checks`,
      hideFromMenu: true,
    },
    {
      id: 'all-checks',
      text: 'All Checks',
      url: `${getConfig().appSubUrl}/pmm-database-checks/all-checks`,
      hideFromMenu: true,
    },
  ],
};

export const PMM_DBAAS_PAGE: NavModelItem = {
  id: 'dbaas',
  text: 'DBaaS',
  subTitle: 'Percona DBaaS',
  icon: 'database',
  url: `${getConfig().appSubUrl}/dbaas`,
  breadcrumbs: [
    {
      title: 'DBaaS',
      url: `${getConfig().appSubUrl}/dbaas`,
    },
  ],
  children: [
    {
      id: 'kubernetes',
      text: 'Kubernetes Cluster',
      url: `${getConfig().appSubUrl}/dbaas/kubernetes`,
      hideFromMenu: true,
    },
    {
      id: 'dbclusters',
      text: 'DB Cluster',
      url: `${getConfig().appSubUrl}/dbaas/dbclusters`,
      hideFromMenu: true,
    },
  ],
};

export const PMM_BACKUP_PAGE: NavModelItem = {
  id: 'backup',
  icon: 'history',
  text: 'Backup',
  subTitle: 'Percona Backups',
  url: `${getConfig().appSubUrl}/backup`,
  breadcrumbs: [
    {
      title: 'Backup',
      url: `${getConfig().appSubUrl}/backup`,
    },
  ],
  children: [
    {
      id: 'backup-inventory',
      text: 'Backup Inventory',
      url: `${getConfig().appSubUrl}/backup/inventory`,
      hideFromMenu: true,
    },
    {
      id: 'restore-history',
      text: 'Restore History',
      url: `${getConfig().appSubUrl}/backup/restore`,
      hideFromMenu: true,
    },
    {
      id: 'scheduled-backups',
      text: 'Scheduled Backups',
      url: `${getConfig().appSubUrl}/backup/scheduled`,
      hideFromMenu: true,
    },
    {
      id: 'storage-locations',
      text: 'Storage Locations',
      url: `${getConfig().appSubUrl}/backup/locations`,
      hideFromMenu: true,
    },
  ],
};

export const PMM_ALERTING_PAGE: NavModelItem = {
  id: 'integrated-alerting',
  icon: 'bell',
  text: 'Integrated Alerting',
  url: `${getConfig().appSubUrl}/integrated-alerting`,
  subTitle: 'Percona Integrated Alerting',
  breadcrumbs: [
    {
      title: 'Integrated Alerting',
      url: `${getConfig().appSubUrl}/integrated-alerting`,
    },
  ],
  children: [
    {
      id: 'integrated-alerting-alerts',
      text: 'Alerts',
      url: `${getConfig().appSubUrl}/integrated-alerting/alerts`,
    },
    {
      id: 'integrated-alerting-rules',
      text: 'Alert Rules',
      url: `${getConfig().appSubUrl}/integrated-alerting/alert-rules`,
    },
    {
      id: 'integrated-alerting-templates',
      text: 'Alert Rule Templates',
      url: `${getConfig().appSubUrl}/integrated-alerting/alert-rule-templates`,
    },
    {
      id: 'integrated-alerting-notification-channels',
      text: 'Notification Channels',
      url: `${getConfig().appSubUrl}/integrated-alerting/notification-channels`,
    },
  ],
};

export const PMM_SETTINGS_PAGE: NavModelItem = {
  id: 'settings',
  icon: 'percona-setting',
  text: 'Settings',
  url: `${getConfig().appSubUrl}/settings`,
  subTitle: 'Percona Settings',
  breadcrumbs: [
    {
      title: 'Settings',
      url: `${getConfig().appSubUrl}/settings`,
    },
  ],
  children: [
    {
      id: 'settings-metrics-resolution',
      text: 'Metrics Resolution',
      url: `${getConfig().appSubUrl}/settings/metrics-resolution`,
    },
    {
      id: 'settings-advanced',
      text: 'Advanced',
      url: `${getConfig().appSubUrl}/settings/advanced-settings`,
    },
    {
      id: 'settings-ssh',
      text: 'SSH',
      url: `${getConfig().appSubUrl}/settings/ssh-key`,
    },
    {
      id: 'settings-alert-manager',
      text: 'Alert Manager',
      url: `${getConfig().appSubUrl}/settings/am-integration`,
    },
    {
      id: 'settings-percona-platform',
      text: 'Percona Platform',
      url: `${getConfig().appSubUrl}/settings/percona-platform`,
    },
    {
      id: 'settings-communication',
      text: 'Communication',
      url: `${getConfig().appSubUrl}/settings/communication`,
    },
  ],
};
