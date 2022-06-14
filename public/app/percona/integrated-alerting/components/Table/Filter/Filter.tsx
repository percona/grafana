import { Icon, IconButton, useStyles2 } from '@grafana/ui';
import React, { useEffect, useState } from 'react';
import { FilterFieldTypes } from '..';
import { getStyles } from './Filter.styles';
import { FilterProps } from './Filter.types';

export const Filter = ({ columns, rawData, setFilteredData }: FilterProps) => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const styles = useStyles2(getStyles);
  const [searchValue, setSearchValue] = useState('');
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const textColumns = columns.filter((value) => FilterFieldTypes.TEXT_FIELD === value.type);

  useEffect(() => {
    const dataArray = rawData.filter((filterValue) => isValueInColumn(filterValue));
    setFilteredData(dataArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData, searchValue]);

  const isValueInColumn = (filterValue: Object) => {
    let result = false;
    textColumns.forEach((column) => {
      if (column.accessor === selectedColumn || selectedColumn === '') {
        // @ts-ignore
        if (isTextIncluded(searchValue, filterValue[column.accessor])) {
          result = true;
          return;
        }
      }
    });
    return result;
  };

  const isTextIncluded = (needle: string, haystack: string): boolean =>
    haystack.toLowerCase().includes(needle.toLowerCase());

  return (
    <>
      <div className={styles.filterWrapper}>
        <span className={styles.filterLabel}>Filter</span>

        <div className={styles.filterActionsWrapper}>
          <Icon name="search" size="xl" />
          <select
            value={selectedColumn}
            onChange={(e) => {
              setSelectedColumn(e.target.value);
            }}
          >
            <option value="">All</option>
            {textColumns.map((column, i) => (
              <option key={i} value={column.accessor?.toString()}>
                {column.Header}
              </option>
            ))}
          </select>
          <input
            placeholder="Search"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Icon name="times" size="xl" />
          <IconButton name="filter" size="xl" onClick={() => setOpenCollapse(!openCollapse)} />
        </div>
      </div>
      <div className={openCollapse ? styles.collapseOpen : styles.collapseClose}>
        <div className={styles.collapseBody}>
          <div>Test</div>
        </div>
      </div>
    </>
  );
};
