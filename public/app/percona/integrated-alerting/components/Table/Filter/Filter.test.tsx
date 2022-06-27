import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Filter } from './Filter';
import { ExtendedColumn, FilterFieldTypes } from '..';
import { CheckDetails } from 'app/percona/check/types';
import * as filterUtils from './Filter.utils';
import { SEARCH_INPUT_FIELD_NAME, SEARCH_SELECT_FIELD_NAME } from './Filter.constants';

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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'http://localhost/graph/pmm-database-checks/all-checks',
  }),
}));

describe('Filter', () => {
  it('should render the filter', async () => {
    render(<Filter columns={columns} />);

    expect(screen.getByTestId('advance-filter-button')).toBeInTheDocument();
    expect(screen.getByTestId('clear-all-button')).toBeInTheDocument();
    expect(screen.getByTestId('filter')).toBeInTheDocument();
  });

  it('should open correctly text fields', async () => {
    render(<Filter columns={columns} />);

    fireEvent.click(screen.getByTestId('open-search-fields'));
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByTestId(SEARCH_INPUT_FIELD_NAME)).toBeInTheDocument();
  });

  it('should correctly show init data in text fields from url query', async () => {
    jest
      .spyOn(filterUtils, 'getQueryParams')
      .mockImplementation(() => ({ [SEARCH_SELECT_FIELD_NAME]: 'summary', [SEARCH_INPUT_FIELD_NAME]: 'data' }));
    render(<Filter columns={columns} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByTestId(SEARCH_INPUT_FIELD_NAME)).toBeInTheDocument();
    expect(screen.getByTestId(SEARCH_INPUT_FIELD_NAME)).toHaveValue('data');
  });

  it('should correctly show init data in advance filter fields from url query', async () => {
    jest.spyOn(filterUtils, 'getQueryParams').mockImplementation(() => ({ disabled: 'true', interval: 'Rare' }));
    render(<Filter columns={columns} />);

    expect(screen.getByText('Rare')).toBeInTheDocument();
    expect(screen.getByTestId('disabled-radio-state')).toBeInTheDocument();
    expect(screen.getByTestId('disabled-radio-state')).toHaveValue('true');
  });

  it('should show only text fields when only text fields are set', async () => {
    jest
      .spyOn(filterUtils, 'getQueryParams')
      .mockImplementation(() => ({ [SEARCH_SELECT_FIELD_NAME]: 'summary', [SEARCH_INPUT_FIELD_NAME]: 'data' }));
    render(<Filter columns={columns} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByTestId(SEARCH_INPUT_FIELD_NAME)).toBeInTheDocument();
    expect(screen.queryByText('Rare')).not.toBeInTheDocument();
    expect(screen.queryByTestId('disabled-radio-state')).not.toBeInTheDocument();
  });

  it('should show only advance filter fields when only advance filter fields are set', async () => {
    jest.spyOn(filterUtils, 'getQueryParams').mockImplementation(() => ({ disabled: 'true', interval: 'Rare' }));
    render(<Filter columns={columns} />);

    expect(screen.queryByText('Name')).not.toBeInTheDocument();
    expect(screen.queryByTestId(SEARCH_INPUT_FIELD_NAME)).not.toBeInTheDocument();
    expect(screen.getByText('Rare')).toBeInTheDocument();
    expect(screen.getByTestId('disabled-radio-state')).toBeInTheDocument();
  });
});
