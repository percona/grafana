import { useEffect, useState } from 'react';
import { logger } from '@percona/platform-core';
import { PAGE_SIZES } from './Pagination.constants';

export const getPageSize = (pageSize: number) =>
  PAGE_SIZES.find(p => p.value === pageSize) ? pageSize : PAGE_SIZES[0].value;

export const useStoredTablePageSize = (tableId: string) => {
  let pageSize = PAGE_SIZES[0].value;
  const fullId = `${tableId}-table-page-size`;

  try {
    const storedValue = parseInt(localStorage.getItem(fullId), 10);

    if (storedValue && !isNaN(storedValue)) {
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
  }, [value]);

  return [value, setValue] as const;
};
