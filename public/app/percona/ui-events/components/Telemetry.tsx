import { logger } from '@percona/platform-core';
import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getPerconaSettings } from 'app/percona/shared/core/selectors';
import { EventStore, EventType } from "app/percona/ui-events/EventStore.service";
import { UIEventsService } from "app/percona/ui-events/UIEvents.service";

export interface UiEventsProps {
}

export const Telemetry: FC<UiEventsProps> = ({}) => {

  const { result } = useSelector(getPerconaSettings);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!!result?.telemetryEnabled) {
        let events = EventStore.collect();
        if (events.size > 0) {
          const notifications = events.get(EventType.NotificationError) || [];
          const fetching = events.get(EventType.Fetching) || [];
          const dashboard_usage = events.get(EventType.DashboardUsage) || [];

          UIEventsService
            .store({ notifications, fetching, dashboard_usage })
            .then(() => {
            })
            .catch((e) => logger.error(e));
        }
      }
    }, 20_000); //TODO: extract to settings

    return () => clearInterval(interval);
  });

  return (
    <>
    </>
  );
};

