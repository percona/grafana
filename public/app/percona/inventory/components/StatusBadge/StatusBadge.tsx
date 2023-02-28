import React, { FC } from 'react';

import { Badge, BadgeColor } from '@grafana/ui';

import { ServiceAgentStatus } from '../../Inventory.types';

import { StatusBadgeProps } from './StatusBadge.types';

export const StatusBadge: FC<StatusBadgeProps> = ({ agents, full }) => {
  if (!agents.length) {
    return null;
  }

  const totalAgents = agents.length;
  const [good, bad] = agents.reduce(
    (acc, agent) => {
      if (agent.status === ServiceAgentStatus.RUNNING || agent.status === ServiceAgentStatus.STARTING) {
        acc[0]++;
      } else {
        acc[1]++;
      }
      return acc;
    },
    [0, 0]
  );
  const percentageNotRunning = bad / totalAgents;
  const badgeColor: BadgeColor = percentageNotRunning === 1 ? 'red' : percentageNotRunning === 0 ? 'green' : 'orange';

  if (percentageNotRunning === 1) {
    return <Badge color={badgeColor} text={`${bad}/${totalAgents}${full ? ' not running' : ''}`} />;
  } else {
    return <Badge color={badgeColor} text={`${good}/${totalAgents}${full ? ' running' : ''}`} />;
  }
};
