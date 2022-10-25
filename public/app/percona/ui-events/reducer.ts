import { processDashboardEvents } from "app/percona/ui-events/events/dashboard";
import { processFetchingEvents } from "app/percona/ui-events/events/fetching";
import { processNotificationEvents } from "app/percona/ui-events/events/notification";

const skipPrefixes = [
  "@@",
  "navIndex/",
  "navBarTree/",
  "panels/removePanels",
  "appNotifications/hideAppNotification",
];

const shouldProcess = (type: string): boolean => {
  if (!type) {
    return false;
  }

  return !skipPrefixes.find(each => type.startsWith(each));
};

export interface Action {
  payload: any;
  type: string;
}

export const uiEventsReducer = (state: any = {}, action: Action) => {
  try {
    if (!shouldProcess(action.type)) {
      return;
    }

    processNotificationEvents(state, action);
    processFetchingEvents(state, action);
    processDashboardEvents(state, action);

  } finally {
    // we should not block execution nor override state
    // noinspection ReturnInsideFinallyBlockJS
    return state;
  }
};
