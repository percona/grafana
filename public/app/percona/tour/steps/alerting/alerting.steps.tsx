import React from 'react';

import { Settings } from 'app/percona/settings/Settings.types';
import { TourStep } from 'app/percona/shared/core/reducers/tour';
import SidebarStep from 'app/percona/tour/components/SidebarStep';

import { Messages } from './alerting.messages';

export const getAlertingTourSteps = (isPmmAdmin = true, settings?: Settings): TourStep[] => [
  {
    selector: '[aria-label="Tab Fired alerts"]',
    mutationObservables: ['.page-body'],
    resizeObservables: ['.page-body'],
    content: <SidebarStep title={Messages.firedAlerts.title} />,
  },
  {
    selector: '[aria-label="Tab Alert rule templates"]',
    content: <SidebarStep title={Messages.alertRuleTemplates.title} />,
  },
  {
    selector: '[aria-label="Tab Alert rules"]',
    content: <SidebarStep title={Messages.alertRules.title} />,
  },
  {
    selector: '[aria-label="Tab Contact points"]',
    content: <SidebarStep title={Messages.contactPoints.title} />,
  },
  {
    selector: '[aria-label="Tab Notification policies"]',
    content: <SidebarStep title={Messages.notificationPolicies.title} />,
  },
  {
    selector: '[aria-label="Tab Silences"]',
    content: <SidebarStep title={Messages.silences.title} />,
  },
  {
    selector: '[aria-label="Tab Alert groups"]',
    content: <SidebarStep title={Messages.alertGroups.title} />,
  },
  {
    selector: '[aria-label="Tab Admin"]',
    content: <SidebarStep title={Messages.admin.title} />,
  },
];

export default getAlertingTourSteps;
