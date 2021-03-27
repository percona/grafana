import { Button } from '@grafana/ui';
import React from 'react';
import { DATABASE_LABELS, Databases } from 'app/percona/shared/core';

const getEngineType = (type?: string) => {
  switch (type) {
    case 'DISCOVER_AZURE_DATABASE_TYPE_MYSQL':
      return DATABASE_LABELS[Databases.mysql];
    case 'DISCOVER_AZURE_DATABASE_TYPE_MARIADB':
      return DATABASE_LABELS[Databases.mysql];
    case 'DISCOVER_AZURE_DATABASE_TYPE_POSTGRESQL':
      return DATABASE_LABELS[Databases.postgresql];
    case 'DISCOVER_AZURE_DATABASE_INVALID':
      return 'Unknown type';
    default:
      return 'Unknown type';
  }
};

const getDatabaseType = (type?: string) => {
  switch (type) {
    case 'DISCOVER_AZURE_DATABASE_TYPE_MYSQL':
      return Databases.mysql;
    case 'DISCOVER_AZURE_DATABASE_TYPE_POSTGRESQL':
      return Databases.postgresql;
    default:
      return '';
  }
};

// @ts-ignore
export const getInstancesColumns = (credentials, onSelectInstance) => [
  {
    Header: 'Region',
    accessor: 'location',
  },
  {
    Header: 'Resource group',
    accessor: 'resource_group',
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Engine',
    accessor: (element: any) => (element.type ? `${getEngineType(element.type)}` : 'nothing'),
  },
  {
    Header: 'Instance ID',
    accessor: 'instance_id',
  },
  {
    Header: 'Address',
    accessor: 'fully_qualified_domain_name',
  },
  {
    Header: 'Action',
    accessor: (element: any) => {
      const selectionHandler = () => {
        onSelectInstance({
          type: getDatabaseType(element.type),
          credentials: { ...{ ...element, ...credentials }, isAzure: true },
        });
      };

      return (
        <Button variant="primary" onClick={selectionHandler}>
          Start monitoring
        </Button>
      );
    },
  },
];
