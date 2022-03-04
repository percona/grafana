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
  url: `${getConfig().appSubUrl}/backup`,
  children: [
    {
      id: 'backup',
      icon: 'history',
      text: 'Backup',
      url: `${getConfig().appSubUrl}/backup`,
    },
  ],
};
