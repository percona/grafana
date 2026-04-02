import { NavIndex, NavModelItem } from '@grafana/data';
import { CategorizedAdvisor } from 'app/percona/shared/services/advisors/Advisors.types';
import config from 'app/core/config';
import { PMM_ALERTING_FIRED_ALERTS, PMM_ALERTING_PERCONA_ALERTS, WEIGHTS } from './PerconaNavigation.constants';
import { isViewer } from 'app/percona/shared/helpers/permissions';

export const buildAdvisorsNavItem = (categorizedAdvisors: CategorizedAdvisor) => {
  const modelItem: NavModelItem = {
    id: `advisors`,
    icon: 'percona-database-checks',
    text: 'Advisors',
    sortWeight: WEIGHTS.alerting,
    subTitle: 'Run and analyze all checks',
    url: `${config.appSubUrl}/advisors`,
    children: [],
  };
  const categories = Object.keys(categorizedAdvisors);

  modelItem.children!.push({
    id: 'advisors-insights',
    text: 'Advisor Insights',
    url: `${config.appSubUrl}/advisors/insights`,
  });

  categories.forEach((category) => {
    modelItem.children!.push({
      id: `advisors-${category}`,
      text: `${category[0].toUpperCase()}${category.substring(1)} Advisors`,
      url: `${config.appSubUrl}/advisors/${category}`,
    });
  });

  return modelItem;
};

export const buildIntegratedAlertingMenuItem = (mainLinks: NavIndex): NavModelItem | undefined => {
  const alertingItem = mainLinks['alerting'];

  if (!alertingItem) {
    return undefined;
  }

  if (alertingItem?.url) {
    alertingItem.url = `${config.appSubUrl}/alerting/alerts`;
  }

  if (isViewer(config.bootData.user)) {
    alertingItem?.children?.unshift(PMM_ALERTING_FIRED_ALERTS);
  } else {
    alertingItem?.children?.unshift(...PMM_ALERTING_PERCONA_ALERTS);
  }

  return alertingItem;
};

export const getPmmSettingsPage = (): NavModelItem => {
  const children: NavModelItem[] = [
    {
      id: 'settings-metrics-resolution',
      text: 'Metrics Resolution',
      url: `${config.appSubUrl}/settings/metrics-resolution`,
    },
    {
      id: 'settings-advanced',
      text: 'Advanced Settings',
      url: `${config.appSubUrl}/settings/advanced-settings`,
    },
    {
      id: 'settings-ssh',
      text: 'SSH Key',
      url: `${config.appSubUrl}/settings/ssh-key`,
    },
  ];

  const page: NavModelItem = {
    id: 'settings',
    icon: 'percona-setting',
    text: 'Settings',
    sortWeight: WEIGHTS.config,
    url: `${config.appSubUrl}/settings`,
    subTitle: 'Percona Settings',
    children,
  };

  return page;
};
