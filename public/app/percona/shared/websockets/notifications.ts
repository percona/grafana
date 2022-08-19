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

      switch (Severity[value.severity]) {
        case Severity.SEVERITY_ALERT:
        case Severity.SEVERITY_CRITICAL:
        case Severity.SEVERITY_ERROR:
        case Severity.SEVERITY_EMERGENCY:
          appEvents.emit(AppEvents.alertError, [message]);
          break;
        case Severity.SEVERITY_WARNING:
        case Severity.SEVERITY_DEBUG:
          appEvents.emit(AppEvents.alertWarning, [message]);
          break;
        case Severity.SEVERITY_INFO:
        case Severity.SEVERITY_NOTICE:
          appEvents.emit(AppEvents.alertSuccess, [message]);
          break;
      }
    });
};
