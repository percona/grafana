import { useEffect, useState } from 'react';
import { logger } from '@percona/platform-core';
import { PAGE_SIZES } from './Pagination.constants';

export const getPageSize = (pageSize: number) =>
  PAGE_SIZES.find(p => p.value === pageSize) ? pageSize : PAGE_SIZES[0].value;

export const useStoredTablePageSize = (tableHash: string) => {
  let pageSize = PAGE_SIZES[0].value;
  const fullHash = `${tableHash}-table-page-size`;

  try {
    const storedValue = +localStorage.getItem(fullHash);

    if (storedValue && !isNaN(storedValue)) {
      pageSize = storedValue;
    }
  } catch (e) {
    logger.error(e);
  }
  const [value, setValue] = useState(getPageSize(pageSize));

  useEffect(() => {
    if (tableHash) {
      localStorage.setItem(fullHash, `${value}`);
    }
  }, [value]);

  return [value, setValue] as const;
};
