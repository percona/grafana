import { FailedCheckSummary } from '../types';

/**
 * A mock version of CheckService
 */
export const CheckService = {
  async getAllFailedChecks(): Promise<FailedCheckSummary[]> {
    return [
      {
        serviceName: 'Service One',
        serviceId: 's1',
        counts: {
          emergency: 0,
          alert: 0,
          critical: 0,
          error: 0,
          warning: 0,
          notice: 0,
          info: 0,
          debug: 0,
        },
      },
    ];
  },
};
