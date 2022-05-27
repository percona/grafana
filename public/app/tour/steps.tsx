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
  {
    selector: '.dropdown > [aria-label="Alerting"]',
    content: (
      <SidebarStep title="PMM Alerting">
        <p>
          Besides Grafana&apos;s native alerting system, PMM comes with a simpler-to-use alerting system that works
          side-by-side with Grafana&apos;s.
        </p>
        <p>
          You define what system metrics are critical for your environment and what thresholds are acceptable for each
          metric. When something needs your attention, PMM automatically sends you an alert through your specified
          communication channels.
        </p>
        <p>To use our alerting system, make sure to activate it via Settings, on this sidebar.</p>
        <p>
          Read more about our alerting{' '}
          <a
            href="https://docs.percona.com/percona-monitoring-and-management/using/alerting.html"
            target="_blank"
            rel="noreferrer noopener"
            style={{ textDecoration: 'underline' }}
          >
            here
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
          From this menu, you can check PMM&apos;s Inventory (Services, Agents and Nodes) as well as adding a new
          instance to be monitored (PostgreSQL, MySQL, MongoDB, HAProxy...).
        </p>
        <p>
          PMM Settings also live here. From there, you can connect your PMM instance to Percona Platform, change all
          sort of advanced settings (e.g. activate PMM&apos;s alerting, DBaaS, ...) and apply other more refined
          settings.
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
          To know more about Advisors, check{' '}
          <a
            href="https://docs.percona.com/percona-platform/checks.html"
            target="_blank"
            rel="noreferrer noopener"
            style={{ textDecoration: 'underline' }}
          >
            here
          </a>
          .
        </p>
      </SidebarStep>
    ),
  },
  {
    selector: '.dropdown > [aria-label="Backup"]',
    content: (
      <SidebarStep title="Backup and Restore">
        <p>
          This PMM feature allows you to backup and restore your MySQL and MongoDB databases to/from an Amazon S3
          location.
        </p>
        <p>Besides regular on-demand backups, you can also schedule your own backups at specific points in time.</p>
        <p>For MongoDB databases, we also include Point-In-Time-Recoverable backups.</p>
        <p>
          Check all details and instructions{' '}
          <a
            href="https://docs.percona.com/percona-monitoring-and-management/using/backup.html#backup-and-restore"
            target="_blank"
            rel="noreferrer noopener"
            style={{ textDecoration: 'underline' }}
          >
            here
          </a>
          .
        </p>
      </SidebarStep>
    ),
  },
];

export default steps;
