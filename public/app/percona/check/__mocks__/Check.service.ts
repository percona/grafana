import { CheckDetails, ServiceFailedCheck } from 'app/percona/check/types';
import { AlertRuleSeverity } from 'app/percona/integrated-alerting/components/AlertRules/AlertRules.types';
import { PaginatedFomattedResponse } from 'app/percona/shared/core';

/**
 * A mock version of CheckService
 */
export const CheckService = {
  async runDbChecks(): Promise<void | {}> {
    return {};
  },
  async getAllChecks(): Promise<CheckDetails[]> {
    return [
      {
        summary: 'Test',
        name: 'test enabled',
        description: 'test enabled description',
        interval: 'STANDARD',
        disabled: false,
        category: 'performance',
      },
      {
        summary: 'Test disabled',
        name: 'test disabled',
        description: 'test disabled description',
        interval: 'RARE',
        disabled: true,
        category: 'security',
      },
    ];
  },
  async changeCheck(): Promise<void | {}> {
    return {};
  },
  async getFailedCheckForService(): Promise<PaginatedFomattedResponse<ServiceFailedCheck[]>> {
    return {
      totals: {
        totalItems: 2,
        totalPages: 1,
      },
      data: [
        {
          summary: 'first failed check',
          description: 'check 1',
          severity: AlertRuleSeverity.SEVERITY_CRITICAL,
          labels: { primary: [], secondary: [] },
          readMoreUrl: 'localhost/check-one',
          serviceName: 'Service One',
          checkName: 'Check One',
          silenced: false,
          alertId: 'alert_1',
        },
        {
          summary: 'second failed check',
          description: 'check 2',
          severity: AlertRuleSeverity.SEVERITY_NOTICE,
          labels: { primary: [], secondary: [] },
          readMoreUrl: '',
          serviceName: 'Service One',
          checkName: 'Check Two',
          silenced: false,
          alertId: 'alert_2',
        },
      ],
    };
  },
};
