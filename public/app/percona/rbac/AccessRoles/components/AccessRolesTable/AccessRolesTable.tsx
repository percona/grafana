import { Table } from '@percona/platform-core';
import React, { FC } from 'react';
import { Column } from 'react-table';

import { Messages } from '../../AccessRole.messages';

import { COLUMNS } from './AccessRolesTable.constants';
import { AccessRolesTableProps } from './AccessRolesTable.types';

const AccessRolesTable: FC<AccessRolesTableProps> = ({ items }) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return <Table emptyMessage={Messages.noRoles} columns={COLUMNS as Column[]} data={items} totalItems={items.length} />;
};

export default AccessRolesTable;
