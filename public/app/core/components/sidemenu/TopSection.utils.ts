import { NavModelItem } from '@grafana/data';
import config from '../../config';

export const buildIntegratedAlertingMenuItem = (mainLinks: NavModelItem[]): NavModelItem[] => {
  const integratedAlertingLinks = [
    {
      id: 'integrated-alerting-alerts',
      text: 'Alerts',
      url: `${config.appSubUrl}/integrated-alerting/alerts`,
    },
    {
      id: 'integrated-alerting-rules',
      text: 'Alert Rules',
      url: `${config.appSubUrl}/integrated-alerting/alert-rules`,
    },
    {
      id: 'integrated-alerting-templates',
      text: 'Alert Rule Templates',
      url: `${config.appSubUrl}/integrated-alerting/alert-rule-templates`,
    },
    {
      id: 'integrated-alerting-notification-channels',
      text: 'Notification Channels',
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
      subTitle: 'Alert rules & notifications',
      children: integratedAlertingLinks,
    });
  } else {
    mainLinks[alertingIndex].children?.unshift(...integratedAlertingLinks, divider);
  }

  return mainLinks;
};
