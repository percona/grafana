import { NavModelItem } from '@grafana/data';
import { getConfig } from 'app/core/config';

export const PMM_STT_PAGE: NavModelItem = {
  id: 'database-checks',
  icon: 'percona-database-checks',
  text: 'Security Checks',
  subTitle: 'Percona Security Checks',
  url: `${getConfig().appSubUrl}/pmm-database-checks`,
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
  icon: 'database',
  url: `${getConfig().appSubUrl}/dbaas`,
  children: [
    {
      id: 'dbaas',
      text: 'DBaaS',
      icon: 'database',
      url: `${getConfig().appSubUrl}/dbaas`,
    },
  ],
};

export const PMM_BACKUP_PAGE: NavModelItem = {
  id: 'backup',
  icon: 'history',
  text: 'Backup',
  subTitle: 'Percona Backups',
  url: `${getConfig().appSubUrl}/backup`,
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
