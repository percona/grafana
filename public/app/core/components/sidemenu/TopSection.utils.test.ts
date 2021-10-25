import config from '../../config';
import { buildIntegratedAlertingMenuItem } from './TopSection.utils';

describe('TopSection.utils', () => {
  const testMenu = [
    {
      id: 'alerting',
      text: 'Alerting',
      children: [
        {
          id: 'test',
          text: 'test',
        },
      ],
    },
  ];

  it('should return menu item with alerting tabs', () => {
    const result = buildIntegratedAlertingMenuItem(testMenu)[0].children || [];
    const firstAlertingLink = {
      id: 'integrated-alerting-alerts',
      text: 'Alerts',
      icon: 'fa fa-exclamation-triangle',
      url: `${config.appSubUrl}/integrated-alerting/alerts`,
    };

    expect(result.length).toBe(6);
    expect(result[0]).toEqual(firstAlertingLink);
  });

  it('should add the alerting section if not existent', () => {
    const result = buildIntegratedAlertingMenuItem([]);

    expect(result[0].id).toBe('alerting');
  });
});
