import React, { FC } from 'react';

import { Link, useStyles2 } from '@grafana/ui';

import { getStyles } from './StatusLink.styles';
import { StatusLinkProps } from './StatusLink.types';

export const StatusLink: FC<StatusLinkProps> = ({ agentsStatus, type, strippedId }) => {
  const link = `/inventory/${type}/${strippedId}/agents`;
  const styles = useStyles2((theme) => getStyles(theme, agentsStatus));

  return (
    <Link href={link} className={styles.link}>
      {agentsStatus}
    </Link>
  );
};
