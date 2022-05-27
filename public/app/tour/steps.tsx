import React from 'react';
import { StepType } from '@reactour/tour';
import SidebarStep from './SidebarStep';

const steps: StepType[] = [
  {
    selector: '.dropdown > [aria-label="PMM dashboards"]',
    content: (
      <SidebarStep title="PMM Dashboards">
        <p>
          Several Grafana dashboards shipped with PMM for efficient database monitoring, from CPU Utilization to MySQL
          Replication Summary.
        </p>
        <p>
          Check our dashboards{' '}
          <a
            href="https://github.com/percona/grafana-dashboards"
            target="_blank"
            rel="noreferrer noopener"
            style={{ textDecoration: 'underline' }}
          >
            repo
          </a>{' '}
          and see how you can contribute with your own dashboard.
        </p>
      </SidebarStep>
    ),
  },
  { selector: '.dropdown > [aria-label="Alerting"]', content: <div>This is Alerting</div> },
  { selector: '.dropdown > [aria-label="Configuration"]', content: <div>This is Configuration</div> },
  { selector: '.dropdown > [aria-label="Advisor Checks"]', content: <div>This is Advisors</div> },
  { selector: '.dropdown > [aria-label="Backup"]', content: <div>This is Backup</div> },
];

export default steps;
