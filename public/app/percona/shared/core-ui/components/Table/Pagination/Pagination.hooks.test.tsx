import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { FC } from 'react';

import { PAGE_SIZES } from './Pagination.constants';
import { useStoredTablePageSize } from './Pagination.hooks';

const TABLE_ID = 'test-id';
const TABLE_STORAGE_ID = `${TABLE_ID}-table-page-size`;
const DEFAULT_VALUE = PAGE_SIZES[0].value;

const TestComponent: FC = () => {
  const [pageSize, setPageSize] = useStoredTablePageSize(TABLE_ID);

  return (
    <>
      <span data-testid="test-span">{`${pageSize}`}</span>
      <input
        data-testid="test-input"
        type="number"
        value={`${pageSize}`}
        onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
      />
    </>
  );
};

const getDataFromLocalStorage = (): number => parseInt(localStorage.getItem(TABLE_STORAGE_ID) || '0', 10);

const setDataOnLocalStorage = (pageSize: number) => localStorage.setItem(TABLE_STORAGE_ID, `${pageSize}`);

describe('useStoredTablePageSize', () => {
  beforeAll(() => {
    localStorage.removeItem(TABLE_STORAGE_ID);
  });
  afterAll(() => {
    localStorage.removeItem(TABLE_STORAGE_ID);
  });

  it('should initially store the default pageSize', () => {
    render(<TestComponent />);
    const storedSize = getDataFromLocalStorage();

    expect(storedSize).toBe(DEFAULT_VALUE);
    localStorage.removeItem(TABLE_STORAGE_ID);
  });

  it('should store the size on local storage after input changes', () => {
    render(<TestComponent />);
    const input = screen.getByTestId('test-input');
    const { value } = PAGE_SIZES[1];

    userEvent.clear(input);
    userEvent.type(input, `${value}`);
    const storedSize = getDataFromLocalStorage();

    expect(storedSize).toBe(value);
  });

  it('should set the size from previous saves', () => {
    const value = PAGE_SIZES[1].value || 0;

    setDataOnLocalStorage(value);
    render(<TestComponent />);
    const span = screen.getByTestId('test-span');

    expect(parseInt(span.innerHTML, 10)).toBe(value);
  });

  it('should set the default if a wrong value is saved', () => {
    localStorage.setItem(TABLE_STORAGE_ID, '1a');
    render(<TestComponent />);
    const span = screen.getByTestId('test-span');
    const storedSize = getDataFromLocalStorage();

    expect(parseInt(span.innerHTML, 10)).toBe(DEFAULT_VALUE);
    expect(storedSize).toBe(DEFAULT_VALUE);
  });
});
