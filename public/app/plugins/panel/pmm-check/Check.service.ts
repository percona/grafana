import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { CheckResultSummaryPayload, FailedCheckSummary } from './types';

const BASE_URL = '/v1/advisors';

/**
 * A service-like object to store the API methods
 */
export const CheckService = {
  async getAllFailedChecks(token?: CancelToken, disableNotifications?: boolean): Promise<FailedCheckSummary[]> {
    const { result = [] } = await api.get<CheckResultSummaryPayload, void>(
      `${BASE_URL}/failedServices`,
      disableNotifications,
      {
        cancelToken: token,
      }
    );

    return result
      .map(
        ({
          service_name,
          service_id,
          emergency_count = '0',
          alert_count = '0',
          critical_count = '0',
          error_count = '0',
          warning_count = '0',
          notice_count = '0',
          info_count = '0',
          debug_count = '0',
        }) => ({
          serviceName: service_name,
          serviceId: service_id,
          counts: {
            emergency: parseInt(emergency_count, 10),
            alert: parseInt(alert_count, 10),
            critical: parseInt(critical_count, 10),
            error: parseInt(error_count, 10),
            warning: parseInt(warning_count, 10),
            notice: parseInt(notice_count, 10),
            info: parseInt(info_count, 10),
            debug: parseInt(debug_count, 10),
          },
        })
      )
      .sort((a, b) => a.serviceName.localeCompare(b.serviceName));
  },
};
