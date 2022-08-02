import { Severity } from './../core/types';
import { AppEvents } from '@grafana/data';
import appEvents from 'app/core/app_events';
import { CheckStreamData } from './notifications.types';

export const checkNotification = (data: CheckStreamData) => {
  data.result.topic === 'checks' &&
    data.result.results?.forEach((value) => {
      const message = `${value.check_name} - ${value.service_name}: ${value.summary}`;

      if (!value.summary && value.service_name) {
        appEvents.emit(AppEvents.alertSuccess, [
          `${value.check_name} - ${value.service_name}: Finished without finding error.`,
        ]);
        return;
      }

      if (
        Severity[value.severity] === Severity.SEVERITY_ALERT ||
        Severity[value.severity] === Severity.SEVERITY_CRITICAL ||
        Severity[value.severity] === Severity.SEVERITY_ERROR ||
        Severity[value.severity] === Severity.SEVERITY_EMERGENCY
      ) {
        appEvents.emit(AppEvents.alertError, [message]);
      }
      if (
        Severity[value.severity] === Severity.SEVERITY_WARNING ||
        Severity[value.severity] === Severity.SEVERITY_NOTICE ||
        Severity[value.severity] === Severity.SEVERITY_DEBUG
      ) {
        appEvents.emit(AppEvents.alertWarning, [message]);
      }
      if (Severity[value.severity] === Severity.SEVERITY_INFO) {
        appEvents.emit(AppEvents.alertSuccess, [message]);
      }
    });
};
