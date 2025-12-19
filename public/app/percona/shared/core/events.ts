import { BusEventBase } from '@grafana/data';

export class SettingsUpdatedEvent extends BusEventBase {
  static type = 'settings-updated-event';
}

export class ServiceAddedEvent extends BusEventBase {
  static type = 'service-added-event';
}
