const cache = new Map();

export enum EventType {
  NotificationError = "NOTIFICATION_ERROR",
  Fetching = "FETCHING",
  DashboardUsage = "DASHBOARD_USAGE",
}

export const EventStore = {
  add: (event: EventType, payload: any) => {
    let current: any[] = cache.get(event);
    if (!current) {
      current = [];
      cache.set(event, current);
    }

    current.push(payload);
  },
  collect: (): Map<string, any> => {
    let copy = new Map(cache);
    cache.clear();
    return copy;
  }
};
