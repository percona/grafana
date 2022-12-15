import React from 'react';
import { Column } from 'react-table';

import { Messages } from '../../AccessRole.messages';
import { AccessRoleRow } from '../../AccessRole.types';
import MetricsColumn from '../MetricsColumn';
import NameCell from '../NameCell';
import OptionsCell from '../OptionsCell';

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
  {
    Header: Messages.options.column,
    width: '50px',
    accessor: (role) => <OptionsCell role={role} />,
  },
];
