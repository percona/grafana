/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
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

const createData = (length: number) =>
  new Array(length).fill(null).map((_, idx) => ({
    value: `test value ${idx + 1}`,
  }));

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

    expect(await screen.findAllByTestId('table-thead-tr')).toHaveLength(1);
    expect(await screen.findAllByTestId('table-tbody-tr')).toHaveLength(2);
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

    expect(await screen.findAllByTestId('table-loading')).toHaveLength(1);
    expect(await screen.findAllByTestId('table')).toHaveLength(1);
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
    const noData = await screen.findByTestId('table-no-data');

    expect(screen.queryByTestId('table-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('table')).not.toBeInTheDocument();
    expect(noData).toBeInTheDocument();
    expect(noData).toHaveTextContent('empty');
  });

  it('should display all data without showPagination', async () => {
    const mockData = [];

    for (let i = 0; i < 100; i += 1) {
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

    expect(await screen.findAllByTestId('table-tbody-tr')).toHaveLength(100);
  });

  it('should display partial data with showPagination using controlled pagination', async () => {
    const mockData = [];

    for (let i = 0; i < 100; i += 1) {
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

    expect(screen.getAllByTestId('table-tbody-tr')).toHaveLength(10);
    expect(screen.getAllByTestId('page-button')).toHaveLength(10);
  });

  it('should display partial data with showPagination using uncontrolled pagination', async () => {
    const mockData = [];

    for (let i = 0; i < 100; i += 1) {
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

    expect(await screen.findAllByTestId('table-tbody-tr')).toHaveLength(5);
    expect(await screen.findAllByTestId('page-button')).toHaveLength(20);
  });

  it('should display selection column', async () => {
    render(
      <Table
        totalItems={data.length}
        data={data}
        columns={columns}
        rowSelection
        onPaginationChanged={onPaginationChanged}
        emptyMessage="empty"
        pageSize={10}
      />
    );

    expect(await screen.findAllByTestId('select-all')).toHaveLength(1);
    expect(await screen.findAllByTestId('select-row')).toHaveLength(2);
  });

  it('should allow selection of specific rows', async () => {
    let selectedValues: any[] = [];

    const onSelectionChanged = (rows: Array<Row<any>>) => {
      selectedValues = rows.map((r) => r.values);
    };

    render(
      <Table
        totalItems={data.length}
        data={data}
        columns={columns}
        rowSelection
        onRowSelection={onSelectionChanged}
        onPaginationChanged={onPaginationChanged}
        emptyMessage="empty"
        pageSize={10}
      />
    );

    const checkbox = await screen.findByTestId('table-select-1-checkbox-input');

    fireEvent.click(checkbox);

    expect(selectedValues.length).toBe(1);
    expect(selectedValues[0]).toStrictEqual(data[1]);
  });

  it('should allow selection of all rows', async () => {
    const tableData = createData(20);
    let selectedValues: any[] = [];

    const onSelectionChanged = (rows: Array<Row<any>>) => {
      selectedValues = rows.map((r) => r.values);
    };

    render(
      <Table
        totalItems={tableData.length}
        data={tableData}
        columns={columns}
        rowSelection
        showPagination
        onRowSelection={onSelectionChanged}
        onPaginationChanged={onPaginationChanged}
        emptyMessage="empty"
        pageSize={10}
      />
    );

    const selectAllCheckbox = await screen.findByTestId('table-select-all-checkbox-input');

    fireEvent.click(selectAllCheckbox);

    expect(selectedValues.length).toBe(20);
    expect(selectedValues).toStrictEqual(tableData);
  });

  it('should select items only in current page when mode set to "page"', async () => {
    const tableData = createData(20);
    let selectedValues: any[] = [];

    const onSelectionChanged = (rows: Array<Row<any>>) => {
      selectedValues = rows.map((r) => r.values);
    };

    render(
      <Table
        totalItems={tableData.length}
        data={tableData}
        columns={columns}
        rowSelection
        showPagination
        onRowSelection={onSelectionChanged}
        onPaginationChanged={onPaginationChanged}
        emptyMessage="empty"
        allRowsSelectionMode="page"
        pageSize={10}
      />
    );

    const selectAllCheckbox = await screen.findByTestId('table-select-all-checkbox-input');

    fireEvent.click(selectAllCheckbox);

    expect(selectedValues.length).toBe(10);
    expect(selectedValues).toStrictEqual(tableData.slice(0, 10));
  });
});
