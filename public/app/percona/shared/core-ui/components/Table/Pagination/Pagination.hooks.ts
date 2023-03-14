/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions */
import { useEffect, useState } from 'react';

import { logger } from '../../../shared';

import { PAGE_SIZES } from './Pagination.constants';

export const getPageSize = (pageSize: number) =>
  PAGE_SIZES.find((size) => size.value === pageSize) ? pageSize : (PAGE_SIZES[0].value as number);

export const useStoredTablePageSize = (tableId: string) => {
  let pageSize = PAGE_SIZES[0].value as number;
  const fullId = `${tableId}-table-page-size`;

  try {
    const storedValue = parseInt(localStorage.getItem(fullId) as string, 10);

    if (storedValue && !Number.isNaN(storedValue)) {
      pageSize = storedValue;
    }
  } catch (e) {
    logger.error(e);
  }
  const [value, setValue] = useState(getPageSize(pageSize));

  useEffect(() => {
    if (tableId) {
      localStorage.setItem(fullId, `${value}`);
    }
  }, [fullId, tableId, value]);

  return [value, setValue] as const;
};
