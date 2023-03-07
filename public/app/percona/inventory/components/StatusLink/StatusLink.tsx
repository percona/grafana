import React, { FC } from 'react';

import { Link, useStyles2 } from '@grafana/ui';

import { ServiceAgentStatus } from '../../Inventory.types';

import { getStyles } from './StatusLink.styles';
import { StatusLinkProps } from './StatusLink.types';

export const StatusLink: FC<StatusLinkProps> = ({ agents, strippedServiceId }) => {
  const agentNotOk = agents.some(
    (agent) => agent.status !== ServiceAgentStatus.RUNNING && agent.status !== ServiceAgentStatus.STARTING
  );
  const link = `/inventory/services/${strippedServiceId}/agents`;
  const styles = useStyles2((theme) => getStyles(theme, agentNotOk));

  return (
    <Link href={link} className={styles.link}>
      {agentNotOk ? 'Failed' : 'OK'}
    </Link>
  );
};
