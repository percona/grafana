import React from 'react';
import { render, screen } from '@testing-library/react';
import { Filter } from './Filter';
import { ExtendedColumn, FilterFieldTypes } from '..';
import { CheckDetails } from 'app/percona/check/types';

const Messages = {
  name: 'Name',
  description: 'Description',
  disabled: 'Status',
  interval: 'Interval',
};

const columns: Array<ExtendedColumn<CheckDetails>> = [
  {
    Header: Messages.name,
    accessor: 'summary',
    type: FilterFieldTypes.TEXT,
  },
  {
    Header: Messages.description,
    accessor: 'description',
    type: FilterFieldTypes.TEXT,
  },
  {
    Header: Messages.disabled,
    accessor: 'disabled',
    type: FilterFieldTypes.RADIO_BUTTON,
    label: 'Test',
    options: [
      {
        label: 'Enabled',
        value: false,
      },
      {
        label: 'Disabled',
        value: true,
      },
    ],
  },
  {
    Header: Messages.interval,
    accessor: 'interval',
    type: FilterFieldTypes.DROPDOWN,
    options: [
      {
        label: 'Standard',
        value: 'Standard',
      },
      {
        label: 'Rare',
        value: 'Rare',
      },
      {
        label: 'Frequent',
        value: 'Frequent',
      },
    ],
  },
];

// const data = [
//   {
//     name: 'test1',
//     description: 'Test desctiption 1',
//     summary: 'Test summary 1',
//     interval: 'interval 1',
//     disabled: false,
//   },
//   {
//     name: 'test2',
//     description: 'Test desctiption 2',
//     summary: 'Test summary 2',
//     interval: 'interval 2',
//     disabled: false,
//   },
//   {
//     name: 'test3',
//     description: 'Test desctiption 3',
//     summary: 'Test summary 3',
//     interval: 'interval 3',
//     disabled: true,
//   },
// ];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/example/path',
  }),
}));

describe('Filter', () => {
  it('should render the filter', async () => {
    render(<Filter columns={columns} />);

    screen.debug();
  });
});
