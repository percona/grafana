import React from 'react';
import { StepType } from '@reactour/tour';
import SidebarStep from './SidebarStep';
import { Messages } from './steps.messages';

const steps: StepType[] = [
  {
    selector: '.dropdown > [aria-label="Dashboards"]',
    content: (
      <SidebarStep title="Dashboards">
        <p>{Messages.dashboards.browse}</p>
        <p>{Messages.dashboards.folders}</p>
        <p>{Messages.dashboards.playlists}</p>
      </SidebarStep>
    ),
  },
  {
    selector: '.dropdown > [aria-label="PMM dashboards"]',
    content: (
      <SidebarStep title="PMM Dashboards">
        <p>{Messages.pmmDashboards.grafanaTechnology}</p>
        <p>{Messages.pmmDashboards.observe}</p>
        <p>{Messages.pmmDashboards.zoomIn}</p>
      </SidebarStep>
    ),
  },
  {
    selector: '.dropdown > [aria-label="Query Analytics (QAN)"]',
    content: (
      <SidebarStep title="PMM Query Analytics">
        <p>{Messages.qan.queries}</p>
        <p>{Messages.qan.analyze}</p>
      </SidebarStep>
    ),
  },
  {
    selector: '.dropdown > [aria-label="Explore"]',
    content: (
      <SidebarStep title="Explore">
        <p>{Messages.explore.data}</p>
        <p>{Messages.explore.graphs}</p>
        <p>{Messages.explore.query}</p>
      </SidebarStep>
    ),
  },
  {
    selector: '.dropdown > [aria-label="Alerting"]',
    content: (
      <SidebarStep title="PMM Alerting">
        <p>{Messages.alerting.simplerToUse}</p>
        <p>{Messages.alerting.youDefine}</p>
        <p>{Messages.alerting.howToUse}</p>
        <p>
          {Messages.alerting.moreInfo}
          <a
            href="https://docs.percona.com/percona-monitoring-and-management/using/alerting.html"
            target="_blank"
            rel="noreferrer noopener"
          >
            {Messages.alerting.docs}
          </a>
          .
        </p>
      </SidebarStep>
    ),
  },
  {
    selector: '.dropdown > [aria-label="Configuration"]',
    content: (
      <SidebarStep title="Configuration Panel">
        <p>{Messages.configPanel.services}</p>
        <p>{Messages.configPanel.settings}</p>
        <p>
          {Messages.configPanel.settingsDocs}{' '}
          <a
            href="https://docs.percona.com/percona-monitoring-and-management/how-to/configure.html"
            target="_blank"
            rel="noreferrer noopener"
          >
            {Messages.configPanel.settingsDocsLink}
          </a>
          .
        </p>
      </SidebarStep>
    ),
  },
  {
    selector: '.dropdown > [aria-label="Server Admin"]',
    content: (
      <SidebarStep title="Server Admin">
        <p>{Messages.serverAdmin.userManagement}</p>
        <ul>
          <li>{Messages.serverAdmin.addEditRemove}</li>
          <li>{Messages.serverAdmin.grant}</li>
          <li>{Messages.serverAdmin.manageOrg}</li>
          <li>{Messages.serverAdmin.changeOrg}</li>
        </ul>
      </SidebarStep>
    ),
  },
  {
    selector: '.dropdown > [aria-label="Advisor Checks"]',
    content: (
      <SidebarStep title="Advisor checks">
        <p>{Messages.advisors.pmmIncludes}</p>
        <p>
          {Messages.advisors.findOutMore}
          <a href="https://docs.percona.com/percona-platform/checks.html" target="_blank" rel="noreferrer noopener">
            {Messages.advisors.docs}
          </a>
          .
        </p>
      </SidebarStep>
    ),
  },
];

export default steps;
