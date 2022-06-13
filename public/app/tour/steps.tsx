import React from 'react';
import { StepType } from '@reactour/tour';
import SidebarStep from './SidebarStep';

const steps: StepType[] = [
  {
    selector: '.dropdown > [aria-label="PMM dashboards"]',
    content: (
      <SidebarStep title="PMM Dashboards">
        <p>
          PMM ships with several Grafana dashboards for efficient database monitoring, from CPU utilization to MySQL
          Replication Summary.
        </p>
        <p>
          Check our{' '}
          <a
            href="https://github.com/percona/grafana-dashboards"
            target="_blank"
            rel="noreferrer noopener"
            style={{ textDecoration: 'underline' }}
          >
            dashboards repo
          </a>{' '}
          and see how you can contribute with your own.
        </p>
      </SidebarStep>
    ),
  },
  {
    selector: '.dropdown > [aria-label="Alerting"]',
    content: (
      <SidebarStep title="PMM Alerting">
        <p>PMM comes with a simpler-to-use alerting system that works side-by-side with Grafana&apos;s.</p>
        <p>
          You define what system metrics are critical to your environment, and what thresholds are acceptable for each
          metric. When something needs your attention, PMM automatically sends you an alert through your specified
          communication channels.
        </p>
        <p>To use PMM Alerting, make sure to activate it via Settings, on this sidebar.</p>
        <p>
          For more information, see the{' '}
          <a
            href="https://docs.percona.com/percona-monitoring-and-management/using/alerting.html"
            target="_blank"
            rel="noreferrer noopener"
            style={{ textDecoration: 'underline' }}
          >
            Integrated Alerting documentation
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
        <p>
          Here you can check Services, Agents and Nodes in your PMM&apos;s Inventory, and add new instances for
          monitoring: PostgreSQL, MySQL, MongoDB, HAProxy, etc.
        </p>
        <p>
          PMM Settings also live here. From there, you can connect your PMM instance to Percona Platform and change more
          advanced settings, for example to activate PMM Alerting, DBaaS, etc.
        </p>
      </SidebarStep>
    ),
  },
  {
    selector: '.dropdown > [aria-label="Advisor Checks"]',
    content: (
      <SidebarStep title="Advisor checks">
        <p>
          PMM includes a set of Advisors that run checks against the databases connected to PMM. The checks identify and
          alert you of potential security threats, performance degradation, data loss, data corruption, non-compliance
          issues, etc.
        </p>
        <p>
          To find out more, check out the{' '}
          <a
            href="https://docs.percona.com/percona-platform/checks.html"
            target="_blank"
            rel="noreferrer noopener"
            style={{ textDecoration: 'underline' }}
          >
            Advisors documentation
          </a>
          .
        </p>
      </SidebarStep>
    ),
  },
];

export default steps;
