import { Severity } from './../core/types';
import { AppEvents } from '@grafana/data';
import appEvents from 'app/core/app_events';
import { CheckStreamData } from './notifications.types';

export const checkNotification = (data: CheckStreamData) => {
  if (data.result.topic === 'checks' && data.result.results) {
    data.result.results.forEach((value) => {
      if (
        Severity[value.severity] === Severity.SEVERITY_WARNING ||
        Severity[value.severity] === Severity.SEVERITY_NOTICE ||
        Severity[value.severity] === Severity.SEVERITY_INFO ||
        Severity[value.severity] === Severity.SEVERITY_DEBUG
      ) {
        appEvents.emit(AppEvents.alertWarning, [value.summary]);
      }
      if (
        Severity[value.severity] === Severity.SEVERITY_ALERT ||
        Severity[value.severity] === Severity.SEVERITY_CRITICAL ||
        Severity[value.severity] === Severity.SEVERITY_ERROR ||
        Severity[value.severity] === Severity.SEVERITY_EMERGENCY
      ) {
        appEvents.emit(AppEvents.alertError, [value.summary]);
      }
    });
  }
};
