import React from 'react';
import { Column } from 'react-table';

import { Messages } from '../../AccessRole.messages';
import { AccessRoleRow } from '../../AccessRole.types';
import MetricsColumn from '../MetricsColumn';
import NameCell from '../NameCell';

export const COLUMNS: Array<Column<AccessRoleRow>> = [
  {
    Header: Messages.name.column,
    accessor: (role) => <NameCell role={role} />,
  },
  {
    Header: Messages.description.column,
    accessor: 'description',
  },
  {
    Header: <MetricsColumn />,
    accessor: 'filter',
  },
];
