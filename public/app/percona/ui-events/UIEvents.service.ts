import { logger } from '@percona/platform-core';

import { ApiRequest } from "app/percona/shared/helpers/api";
import { NotificationErrorEvent } from "app/percona/ui-events/events/notification";
import { DashboardUsageEvent } from "app/percona/ui-events/events/dashboard";
import { FetchingEvent } from "app/percona/ui-events/events/fetching";

const api = new ApiRequest({ baseURL: '/v1/ui-events' });

interface UIEventsStoreRequest {
  notifications: NotificationErrorEvent[];
  fetching: FetchingEvent[];
  dashboard_usage: DashboardUsageEvent[];
}

interface TelemetryStoreResponse {
}

export const UIEventsService = {
  async store(body: UIEventsStoreRequest): Promise<void> {
    try {
      await api.post<TelemetryStoreResponse, any>(
        '/Store',
        body,
        true,
      );
    } catch (e) {
      logger.error(e);
    }
  },
};
