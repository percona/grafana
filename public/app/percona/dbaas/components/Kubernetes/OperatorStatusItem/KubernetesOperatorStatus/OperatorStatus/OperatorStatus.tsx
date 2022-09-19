import React, { FC } from 'react';

import { Badge, BadgeColor } from '@grafana/ui';
import { Messages } from 'app/percona/dbaas/DBaaS.messages';

import { KubernetesOperatorStatus as Status, KubernetesOperatorStatusColors } from '../KubernetesOperatorStatus.types';

import { STATUS_DATA_QA } from './OperatorStatus.constants';
import { OperatorStatusProps } from './OperatorStatus.types';

const { operatorStatus } = Messages.kubernetes;

export const OperatorStatus: FC<OperatorStatusProps> = ({ operator }) => {
  const { status, availableVersion } = operator;
  const showVersionAvailable = (status === Status.ok || status === Status.unsupported) && !!availableVersion;

  const statusColor: BadgeColor = showVersionAvailable ? 'orange' : KubernetesOperatorStatusColors[status];
  const externalLink: boolean = status === Status.unavailable || showVersionAvailable;

  return (
    <Badge
      text={
        <>
          {operatorStatus[status]}
          {showVersionAvailable && <span> {operatorStatus.getNewVersionAvailable(availableVersion)}</span>}
        </>
      }
      color={statusColor}
      data-testid={`cluster-status-${STATUS_DATA_QA[status]}`}
      icon={externalLink ? 'external-link-alt' : undefined}
    />
  );
};
