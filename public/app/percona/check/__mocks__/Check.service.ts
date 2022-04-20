import { CheckDetails } from 'app/percona/check/types';

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
      },
      {
        summary: 'Test disabled',
        name: 'test disabled',
        description: 'test disabled description',
        interval: 'RARE',
        disabled: true,
      },
    ];
  },
  async changeCheck(): Promise<void | {}> {
    return {};
  },
};
