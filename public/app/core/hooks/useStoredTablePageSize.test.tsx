import { mount } from 'enzyme';
import React, { FC } from 'react';
import { useStoredTablePageSize } from './useStoredTablePageSize';

const TABLE_HASH = 'test-hash';
const TABLE_HASH_STORAGE_ID = `${TABLE_HASH}-table-page-size`;

const TestComponent: FC = () => {
  const [pageSize, setPageSize] = useStoredTablePageSize(TABLE_HASH);

  return (
    <>
      <span>{pageSize}</span>
      <input type="number" value={pageSize} onChange={e => setPageSize(+e.target.value)} />
    </>
  );
};

const getDataFromLocalStorage = (): number => {
  return +localStorage.getItem(TABLE_HASH_STORAGE_ID);
};

describe('useStoredTablePageSize', () => {
  beforeAll(() => {
    localStorage.removeItem(TABLE_HASH_STORAGE_ID);
  });
  afterAll(() => {
    localStorage.removeItem(TABLE_HASH_STORAGE_ID);
  });

  it('should initially store the default pageSize', () => {
    mount(<TestComponent />);
    const storedSize = getDataFromLocalStorage();
    expect(storedSize).toBe(1);
    localStorage.removeItem(TABLE_HASH_STORAGE_ID);
  });

  it('should store the size on local storage after input changes', () => {
    const wrapper = mount(<TestComponent />);
    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 20 } });
    const storedSize = getDataFromLocalStorage();
    expect(storedSize).toBe(20);
  });

  it('should set the size from previous saves', () => {
    const wrapper = mount(<TestComponent />);
    const span = wrapper.find('span').first();
    expect(+span.text()).toBe(20);
  });

  it('should set the default if a wrong value is saved', () => {
    localStorage.setItem(TABLE_HASH_STORAGE_ID, '1a');
    const wrapper = mount(<TestComponent />);
    const span = wrapper.find('span').first();
    const storedSize = getDataFromLocalStorage();
    expect(+span.text()).toBe(1);
    expect(storedSize).toBe(1);
  });
});
