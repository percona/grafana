import { PaginatedPayload } from 'app/percona/shared/core/types';

export interface CheckResultSummary {
  service_name: string;
  service_id: string;
  // Number of failed checks for this service with severity level "EMERGENCY".
  emergency_count: string;
  // Number of failed checks for this service with severity level "ALERT".
  alert_count: string;
  // Number of failed checks for this service with severity level "CRITICAL".
  critical_count: string;
  // Number of failed checks for this service with severity level "ERROR".
  error_count: string;
  // Number of failed checks for this service with severity level "WARNING".
  warning_count: string;
  // Number of failed checks for this service with severity level "NOTICE".
  notice_count: string;
  // Number of failed checks for this service with severity level "INFO".
  info_count: string;
  // Number of failed checks for this service with severity level "DEBUG".
  debug_count: string;
}

export interface CheckResultSummaryPayload extends PaginatedPayload {
  result: CheckResultSummary[];
}

export interface FailedChecksCounts {
  emergency: number;
  alert: number;
  critical: number;
  error: number;
  warning: number;
  notice: number;
  info: number;
  debug: number;
}

export interface FailedCheckSummary {
  serviceName: string;
  serviceId: string;
  counts: FailedChecksCounts;
}
