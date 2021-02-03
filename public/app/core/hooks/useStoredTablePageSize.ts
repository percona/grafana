import { useEffect, useState } from 'react';
import { logger } from '@percona/platform-core';
import { PAGE_SIZES } from '../constants';

const getProperPageSize = (pageSize: number) =>
  PAGE_SIZES.find(p => p.value === pageSize) ? pageSize : PAGE_SIZES[0].value;

export const useStoredTablePageSize = (tableHash: string) => {
  let pageSize = 1;
  const fullHash = `${tableHash}-table-page-size`;

  try {
    const storedValue = +localStorage.getItem(fullHash);

    if (storedValue && !isNaN(storedValue)) {
      pageSize = storedValue;
    }
  } catch (e) {
    logger.error(e);
  }
  const [value, setValue] = useState(getProperPageSize(pageSize));

  useEffect(() => {
    if (tableHash) {
      localStorage.setItem(fullHash, `${value}`);
    }
  }, [value]);

  return [value, setValue] as const;
};
