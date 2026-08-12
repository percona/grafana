import { fireEvent, render, screen } from '@testing-library/react';
import { Row } from 'react-table';

import { Table } from './Table';

const columns = [
  {
    Header: 'test col 1',
    accessor: 'value',
  },
];

const data = [
  {
    value: 'test value 1',
  },
  {
    value: 'test value 2',
  },
];

const onPaginationChanged = jest.fn();

describe('Table', () => {
  it('should render the table', async () => {
    render(
      <Table
        totalItems={data.length}
        data={data}
        columns={columns}
        onPaginationChanged={onPaginationChanged}
        pageSize={10}
      />
    );

    expect(screen.getByTestId('table-thead').querySelectorAll('tr')).toHaveLength(1);
    expect(screen.getByTestId('table-tbody').querySelectorAll('tr')).toHaveLength(2);
    expect(screen.queryByTestId('table-no-data')).not.toBeInTheDocument();
  });

  it('should render the loader when data fetch is pending', async () => {
    render(
      <Table
        totalItems={data.length}
        data={data}
        columns={columns}
        onPaginationChanged={onPaginationChanged}
        pendingRequest
        pageSize={10}
      />
    );

    expect(screen.getAllByTestId('table-loading')).toHaveLength(1);
    expect(screen.getAllByTestId('table')).toHaveLength(1);
    expect(screen.queryByTestId('table-no-data')).not.toBeInTheDocument();
  });

  it('should display the noData section when no data is passed', async () => {
    render(
      <Table
        totalItems={data.length}
        data={[]}
        columns={columns}
        onPaginationChanged={onPaginationChanged}
        emptyMessage="empty"
        pageSize={10}
      />
    );
    const noData = screen.getByTestId('table-no-data');

    expect(screen.queryByTestId('table-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('table')).not.toBeInTheDocument();
    expect(noData).toBeInTheDocument();
    expect(noData.textContent).toEqual('empty');
  });

  it('should display all data without showPagination', () => {
    const mockData = [];

    for (let i = 0; i < 100; i++) {
      mockData.push({ value: i });
    }

    render(
      <Table
        totalItems={mockData.length}
        data={mockData}
        columns={columns}
        onPaginationChanged={onPaginationChanged}
        emptyMessage="empty"
      />
    );

    expect(screen.getByTestId('table-tbody').querySelectorAll('tr')).toHaveLength(100);
  });

  it('should display partial data with showPagination using controlled pagination', () => {
    const mockData = [];

    for (let i = 0; i < 100; i++) {
      mockData.push({ value: i });
    }

    render(
      <Table
        showPagination
        totalItems={mockData.length}
        totalPages={10}
        pagesPerView={50}
        data={mockData.slice(0, 10)}
        columns={columns}
        onPaginationChanged={jest.fn()}
        emptyMessage="empty"
      />
    );

    expect(screen.getByTestId('table-tbody').querySelectorAll('tr')).toHaveLength(10);
    expect(screen.getAllByTestId('page-button')).toHaveLength(9);
    expect(screen.getAllByTestId('page-button-active')).toHaveLength(1);
  });

  it('should display partial data with showPagination using uncontrolled pagination', () => {
    const mockData = [];

    for (let i = 0; i < 100; i++) {
      mockData.push({ value: i });
    }

    render(
      <Table
        showPagination
        totalItems={mockData.length}
        pageSize={5}
        pagesPerView={50}
        data={mockData}
        columns={columns}
        onPaginationChanged={jest.fn()}
        emptyMessage="empty"
      />
    );

    expect(screen.getByTestId('table-tbody').querySelectorAll('tr')).toHaveLength(5);
    expect(screen.getAllByTestId('page-button')).toHaveLength(19);
    expect(screen.getAllByTestId('page-button-active')).toHaveLength(1);
  });

  it('should select all rows when rowSelection is enabled', () => {
    const onRowSelection = jest.fn();

    render(
      <Table
        totalItems={data.length}
        data={data}
        columns={columns}
        onPaginationChanged={onPaginationChanged}
        rowSelection
        onRowSelection={onRowSelection}
      />
    );

    fireEvent.click(screen.getByTestId('table-select-all-checkbox-input'));

    const selectedRows: Array<Row<{ value: string }>> = onRowSelection.mock.lastCall[0];
    expect(selectedRows).toHaveLength(2);
  });

  it('should disable selection of rows not matching the rowSelection predicate', () => {
    const onRowSelection = jest.fn();

    render(
      <Table
        totalItems={data.length}
        data={data}
        columns={columns}
        onPaginationChanged={onPaginationChanged}
        rowSelection={(row: Row<{ value: string }>) => row.original.value !== 'test value 1'}
        onRowSelection={onRowSelection}
      />
    );

    const firstRowCheckbox = screen.getByTestId('table-select-0-checkbox-input');
    expect(firstRowCheckbox).toBeDisabled();
    expect(screen.getByTestId('table-select-1-checkbox-input')).toBeEnabled();

    fireEvent.click(firstRowCheckbox);
    expect(onRowSelection.mock.lastCall[0]).toHaveLength(0);
  });

  it('should skip non-selectable rows when selecting all', () => {
    const onRowSelection = jest.fn();

    render(
      <Table
        totalItems={data.length}
        data={data}
        columns={columns}
        onPaginationChanged={onPaginationChanged}
        rowSelection={(row: Row<{ value: string }>) => row.original.value !== 'test value 1'}
        onRowSelection={onRowSelection}
      />
    );

    fireEvent.click(screen.getByTestId('table-select-all-checkbox-input'));

    const selectedRows: Array<Row<{ value: string }>> = onRowSelection.mock.lastCall[0];
    expect(selectedRows).toHaveLength(1);
    expect(selectedRows[0].original.value).toBe('test value 2');

    fireEvent.click(screen.getByTestId('table-select-all-checkbox-input'));
    expect(onRowSelection.mock.lastCall[0]).toHaveLength(0);
  });
});
