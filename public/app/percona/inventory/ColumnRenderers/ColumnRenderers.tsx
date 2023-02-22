import React from 'react';

import { TagList } from '@grafana/ui';
import { CustomLabel } from 'app/percona/inventory/Inventory.types';

import { Model } from '../Inventory.tools';

import * as styles from './ColumnRenderers.styles';

export const agentsDetailsRender = (element: Model) => {
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
            {element.service_ids.map((serviceId: string) => (
              <span key={serviceId}>{serviceId}</span>
            ))}
          </span>
        </>
      ) : null}
      {getCustomLabels(element.custom_labels)}
    </div>
  );
};

export const nodesDetailsRender = (element: Model) => {
  const mainColumns = ['node_id', 'node_name', 'address', 'custom_labels', 'type', 'isDeleted'];
  const labels = Object.keys(element).filter((label) => !mainColumns.includes(label));

  return (
    <>
      <TagList tags={labels.map((label) => `${label}=${element[label]}`)} displayMax={3} />
      <TagList tags={element.custom_labels.map(({ key, value }) => `${key}=${value}`)} />
    </>
  );
};

export const getCustomLabels = (customLabels: CustomLabel[]) =>
  Array.isArray(customLabels) ? <TagList tags={customLabels.map(({ key, value }) => `${key}=${value}`)} /> : null;
