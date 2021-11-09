import { NavModelItem } from '@grafana/data';
import config from '../../config';

export const buildIntegratedAlertingMenuItem = (mainLinks: NavModelItem[]): NavModelItem[] => {
  const integratedAlertingLinks: NavModelItem[] = [
    {
      id: 'integrated-alerting-alerts',
      text: 'Alerts',
      icon: 'fa fa-exclamation-triangle',
      url: `${config.appSubUrl}/integrated-alerting/alerts`,
    },
    {
      id: 'integrated-alerting-rules',
      text: 'Alert Rules',
      icon: 'fa fa-list',
      url: `${config.appSubUrl}/integrated-alerting/alert-rules`,
    },
    {
      id: 'integrated-alerting-templates',
      text: 'Alert Rule Templates',
      icon: 'fa fa-code',
      url: `${config.appSubUrl}/integrated-alerting/alert-rule-templates`,
    },
    {
      id: 'integrated-alerting-notification-channels',
      text: 'Notification Channels',
      icon: 'fa fa-bullhorn',
      url: `${config.appSubUrl}/integrated-alerting/notification-channels`,
    },
  ];
  const divider = {
    id: 'divider',
    text: 'Divider',
    divider: true,
    hideFromTabs: true,
  };
  const alertingIndex = mainLinks.findIndex(({ id }) => id === 'alerting');

  if (alertingIndex === -1) {
    mainLinks.push({
      id: 'alerting',
      text: 'Alerting',
      icon: 'bell',
      url: `${config.appSubUrl}/integrated-alerting/alerts`,
      subTitle: 'Alert rules & notifications',
      children: integratedAlertingLinks,
    });
  } else {
    mainLinks[alertingIndex].children?.unshift(...integratedAlertingLinks, divider);
  }

  return mainLinks;
};
