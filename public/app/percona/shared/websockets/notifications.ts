import { Severity } from './../core/types';
import { AppEvents } from '@grafana/data';
import appEvents from 'app/core/app_events';
import { CheckStreamData } from './notifications.types';
import { Messages } from './notifications.messages';

export const checkNotification = (data: CheckStreamData) => {
  data.result.topic === 'checks' &&
    data.result.results?.forEach((value) => {
      const message = `${value.summary}/${value.service_name}: ${value.alert_message}`;

      if (!value.alert_message && value.service_name) {
        appEvents.emit(AppEvents.alertSuccess, [`${value.summary}/${value.service_name}: ${Messages.noProblemFound}`]);
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
        Severity[value.severity] === Severity.SEVERITY_DEBUG
      ) {
        appEvents.emit(AppEvents.alertWarning, [message]);
      }
      if (
        Severity[value.severity] === Severity.SEVERITY_INFO ||
        Severity[value.severity] === Severity.SEVERITY_NOTICE
      ) {
        appEvents.emit(AppEvents.alertSuccess, [message]);
      }
    });
};
