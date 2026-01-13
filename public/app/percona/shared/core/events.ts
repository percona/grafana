/**
 * @fileoverview
 * Same events as in ui/apps/pmm-compat/src/lib/events.ts in pmm repository
 * NEEDS TO BE UPDATED WHEN PMM EVENTS ARE UPDATED
 */

import { BusEventBase } from '@grafana/data';

export class SettingsUpdatedEvent extends BusEventBase {
  static type = 'settings-updated-event';
}

export class ServiceAddedEvent extends BusEventBase {
  static type = 'service-added-event';
}

export class ServiceDeletedEvent extends BusEventBase {
  static type = 'service-deleted-event';
}
