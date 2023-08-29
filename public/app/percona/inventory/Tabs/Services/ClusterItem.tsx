import React, { FC, useCallback, useState } from 'react';
import { Row } from 'react-table';

import { Collapse, HorizontalGroup, Icon, IconName } from '@grafana/ui';
import { DATABASE_ICONS } from 'app/percona/shared/core';

import { FlattenService } from '../../Inventory.types';

import { ClusterItemProps } from './Clusters.type';
import ServicesTable from './ServicesTable';

const ClusterItem: FC<ClusterItemProps> = ({ cluster, onDelete, onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const icon: IconName = cluster.type ? (DATABASE_ICONS[cluster.type] as IconName) : 'database';

  const handleSelectionChange = useCallback(
    (services: Array<Row<FlattenService>>) => {
      onSelectionChange(cluster, services);
    },
    [cluster, onSelectionChange]
  );

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
        onSelectionChange={handleSelectionChange}
      />
    </Collapse>
  );
};

export default ClusterItem;
