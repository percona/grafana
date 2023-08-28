import React, { FC, useState } from 'react';

import { Collapse, HorizontalGroup, Icon, IconName } from '@grafana/ui';
import { DATABASE_ICONS } from 'app/percona/shared/core';

import { ClusterItemProps } from './Clusters.type';
import ServicesTable from './ServicesTable';

const ClusterItem: FC<ClusterItemProps> = ({ cluster, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const icon: IconName = cluster.type ? (DATABASE_ICONS[cluster.type] as IconName) : 'database';

  return (
    <Collapse
      collapsible
      label={
        <HorizontalGroup>
          {!!icon && <Icon name={icon} data-testid="service-icon" />}
          <span>{cluster.name}</span>
        </HorizontalGroup>
      }
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      <ServicesTable
        flattenServices={cluster.services}
        isLoading={false}
        onDelete={onDelete}
        onSelectionChange={console.log}
      />
    </Collapse>
  );
};

export default ClusterItem;
