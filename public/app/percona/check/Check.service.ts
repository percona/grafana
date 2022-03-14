import { API, PaginatedFomattedResponse } from 'app/percona/shared/core';
import { api } from 'app/percona/shared/helpers/api';
import { CancelToken } from 'axios';
import {
  ActiveCheck,
  Alert,
  AlertState,
  AllChecks,
  ChangeCheckBody,
  CheckDetails,
  CheckResultForServicePayload,
  CheckResultSummaryPayload,
  FailedChecks,
  FailedCheckSummary,
  ServiceFailedCheck,
  Severity,
} from 'app/percona/check/types';
import { SEVERITIES_ORDER } from 'app/percona/check/CheckPanel.constants';
import { AlertRuleSeverity } from '../integrated-alerting/components/AlertRules/AlertRules.types';

export const makeApiUrl: (segment: string) => string = (segment) => `${API.ALERTMANAGER}/${segment}`;
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

    return result.map(({ service_name, service_id, critical_count = 0, major_count = 0, trivial_count = 0 }) => ({
      serviceName: service_name,
      serviceId: service_id,
      criticalCount: critical_count,
      majorCount: major_count,
      trivialCount: trivial_count,
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
      data: results.map(
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
          severity: AlertRuleSeverity[severity],
          labels,
          readMoreUrl: read_more_url,
          serviceName: service_name,
          checkName: check_name,
          silenced: !!silenced,
          alertId: alert_id,
        })
      ),
    };
  },
  silenceAlert(alertId: string, silence: boolean, token?: CancelToken) {
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
  async getAllChecks(token?: CancelToken): Promise<CheckDetails[] | undefined> {
    const response = await api.post<AllChecks, {}>('/v1/management/SecurityChecks/List', {}, false, token);

    return response ? response.checks : undefined;
  },
  changeCheck(body: ChangeCheckBody, token?: CancelToken): Promise<void | {}> {
    return api.post<{}, ChangeCheckBody>('/v1/management/SecurityChecks/Change', body, false, token);
  },
};

export const processData = (data: Alert[]): ActiveCheck[] => {
  const result: Record<
    string,
    Array<{
      summary: string;
      description: string;
      severity: string;
      labels: { [key: string]: string };
      silenced: boolean;
      readMoreUrl: string;
    }>
  > = data
    .filter((alert) => !!alert.labels.stt_check)
    .reduce((acc, alert) => {
      const {
        labels,
        annotations: { summary, description, read_more_url },
        status: { state },
      } = alert;
      const serviceName = labels.service_name;

      if (!serviceName) {
        return acc;
      }

      const item = {
        summary,
        description,
        severity: labels.severity,
        labels,
        silenced: state === AlertState.suppressed,
        readMoreUrl: read_more_url,
      };

      acc[serviceName] = (acc[serviceName] ?? []).concat(item);

      return acc;
    }, {} as any);

  return Object.entries(result).map(([name, value], i) => {
    const failed = value.reduce(
      (acc, val) => {
        if (val.severity === 'error') {
          acc[SEVERITIES_ORDER.error] += 1;
        }

        if (val.severity === 'warning') {
          acc[SEVERITIES_ORDER.warning] += 1;
        }

        if (val.severity === 'notice') {
          acc[SEVERITIES_ORDER.notice] += 1;
        }

        return acc;
      },
      [0, 0, 0] as FailedChecks
    );

    const details = value
      .map((val) => ({
        description: `${val.summary}${val.description ? `: ${val.description}` : ''}`,
        labels: val.labels ?? [],
        silenced: val.silenced,
        readMoreUrl: val.readMoreUrl,
      }))
      .sort((a, b) => {
        const aSeverity: Severity = a.labels.severity as Severity;
        const bSeverity: Severity = b.labels.severity as Severity;

        return SEVERITIES_ORDER[aSeverity] - SEVERITIES_ORDER[bSeverity];
      });

    return {
      key: String(i),
      name,
      failed,
      details,
    };
  });
};

export const sumFailedChecks = (checks: ActiveCheck[]): FailedChecks =>
  checks
    .map((rec) => rec.failed)
    .reduce(
      (acc, failed) => {
        acc[0] += failed[0];
        acc[1] += failed[1];
        acc[2] += failed[2];

        return acc;
      },
      [0, 0, 0]
    );
