import { API, PaginatedFomattedResponse, Severity } from 'app/percona/shared/core';
import { api } from 'app/percona/shared/helpers/api';
import { CancelToken } from 'axios';
import {
  AllChecks,
  ChangeCheckBody,
  CheckDetails,
  CheckResultForServicePayload,
  CheckResultSummaryPayload,
  FailedCheckSummary,
  ServiceFailedCheck,
} from 'app/percona/check/types';

import { formatLabels } from '../shared/helpers/labels';

export const makeApiUrl: (segment: string) => string = (segment) => `${API.ALERTMANAGER}/${segment}`;
const order = {
  [Severity.SEVERITY_EMERGENCY]: 1,
  [Severity.SEVERITY_ALERT]: 2,
  [Severity.SEVERITY_CRITICAL]: 3,
  [Severity.SEVERITY_ERROR]: 4,
  [Severity.SEVERITY_WARNING]: 5,
  [Severity.SEVERITY_NOTICE]: 6,
  [Severity.SEVERITY_INFO]: 7,
  [Severity.SEVERITY_DEBUG]: 8,
};
const BASE_URL = '/v1/management/SecurityChecks';

/**
 * A service-like object to store the API methods
 */
export const CheckService = {
  async getAllFailedChecks(token?: CancelToken): Promise<FailedCheckSummary[]> {
    const { result = [] } = await api.post<CheckResultSummaryPayload, Object>(
      `${BASE_URL}/ListFailedServices`,
      {},
      false,
      token
    );

    return result.map(({ service_name, service_id, ...counts }) => ({
      serviceName: service_name,
      serviceId: service_id,
      counts: {
        emergency: parseInt(counts.emergency_count, 10),
        alert: parseInt(counts.alert_count, 10),
        critical: parseInt(counts.critical_count, 10),
        error: parseInt(counts.error_count, 10),
        warning: parseInt(counts.warning_count, 10),
        notice: parseInt(counts.notice_count, 10),
        info: parseInt(counts.info_count, 10),
        debug: parseInt(counts.debug_count, 10),
      },
    }));
  },
  async getFailedCheckForService(
    serviceId: string,
    pageSize: number,
    pageIndex: number,
    token?: CancelToken
  ): Promise<PaginatedFomattedResponse<ServiceFailedCheck[]>> {
    const {
      results = [],
      page_totals: { total_items: totalItems = 0, total_pages: totalPages = 1 },
    } = await api.post<CheckResultForServicePayload, Object>(
      `${BASE_URL}/FailedChecks`,
      { service_id: serviceId, page_params: { page_size: pageSize, index: pageIndex } },
      false,
      token
    );

    return {
      totals: {
        totalItems,
        totalPages,
      },
      data: results
        .map(
          ({
            summary,
            description,
            severity,
            labels = {},
            read_more_url,
            service_name,
            check_name,
            silenced,
            alert_id,
          }) => ({
            summary,
            description,
            severity: Severity[severity],
            labels: formatLabels(labels),
            readMoreUrl: read_more_url,
            serviceName: service_name,
            checkName: check_name,
            silenced: !!silenced,
            alertId: alert_id,
          })
        )
        .sort((a, b) => order[a.severity] - order[b.severity]),
    };
  },
  async silenceAlert(alertId: string, silence: boolean, token?: CancelToken) {
    return api.post<void, any>(
      `${BASE_URL}/ToggleCheckAlert`,
      {
        alert_id: alertId,
        silence,
      },
      false,
      token
    );
  },
  runDbChecks(token?: CancelToken): Promise<void | {}> {
    return api.post<{}, {}>('/v1/management/SecurityChecks/Start', {}, false, token);
  },
  async getAllChecks(token?: CancelToken): Promise<CheckDetails[]> {
    const response = await api.post<AllChecks, object>('/v1/management/SecurityChecks/List', {}, false, token);

    return response && response.checks ? response.checks.sort((a, b) => a.summary.localeCompare(b.summary)) : [];
  },
  runIndividualDbCheck(checkName: string, token?: CancelToken): Promise<void | {}> {
    return api.post<{}, {}>(
      '/v1/management/SecurityChecks/Start',
      {
        names: [checkName],
      },
      false,
      token
    );
  },
  changeCheck(body: ChangeCheckBody, token?: CancelToken): Promise<void | {}> {
    return api.post<{}, ChangeCheckBody>('/v1/management/SecurityChecks/Change', body, false, token);
  },
};
