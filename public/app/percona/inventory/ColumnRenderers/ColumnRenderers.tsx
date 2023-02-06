/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { HorizontalGroup, Icon, Tooltip } from '@grafana/ui';
import { MAIN_COLUMN } from 'app/percona/inventory/Inventory.constants';
import { CustomLabel } from 'app/percona/inventory/Inventory.types';

import { Messages } from '../Inventory.messages';
import ServicesOptions from '../components/ServicesOptions/ServicesOptions';

import * as styles from './ColumnRenderers.styles';

export const servicesDetailsRender = (element: any) => {
  const labels = Object.keys(element).filter((label) => !MAIN_COLUMN.includes(label));

  return (
    <div className={styles.detailsWrapper}>
      {labels.map((label, accessor) =>
        element[label] ? <span key={accessor}>{`${label}: ${element[label]}`}</span> : null
      )}
      {getCustomLabels(element.custom_labels)}
    </div>
  );
};

export const servicesLabelsHeaderRender = (): React.ReactElement => (
  <HorizontalGroup>
    <span>{Messages.services.table.labels}</span>
    <Tooltip content={Messages.services.table.labelsTooltip}>
      <Icon name="info-circle" />
    </Tooltip>
  </HorizontalGroup>
);

export const servicesOptionsRender = (element: any) => <ServicesOptions service={element} />;

export const agentsDetailsRender = (element: any) => {
  const mainColumns = ['agent_id', 'type', 'isDeleted', 'service_ids', 'custom_labels'];
  const labels = Object.keys(element).filter((label) => !mainColumns.includes(label));

  return (
    <div className={styles.detailsWrapper}>
      {labels.map((label, key) => (element[label] ? <span key={key}>{`${label}: ${element[label]}`}</span> : null))}
      {element.username ? <span>password: ******</span> : null}
      {element.service_ids && element.service_ids.length ? (
        <>
          service_ids:{' '}
          <span>
            {element.service_ids.map((serviceId: any) => (
              <span key={serviceId}>{serviceId}</span>
            ))}
          </span>
        </>
      ) : null}
      {getCustomLabels(element.custom_labels)}
    </div>
  );
};

export const nodesDetailsRender = (element: any) => {
  const mainColumns = ['node_id', 'node_name', 'address', 'custom_labels', 'type', 'isDeleted'];
  const labels = Object.keys(element).filter((label) => !mainColumns.includes(label));

  return (
    <div className={styles.detailsWrapper}>
      {labels.map((label, key) => (element[label] ? <span key={key}>{`${label}: ${element[label]}`}</span> : null))}
      {getCustomLabels(element.custom_labels)}
    </div>
  );
};

export const getCustomLabels = (customLabels: CustomLabel[]) =>
  Array.isArray(customLabels)
    ? customLabels.map(({ key, value }) => <span key={key}> {`${key}: ${value}`}</span>)
    : null;
