import { useEffect, useState } from 'react';
import { logger } from '@percona/platform-core';

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
  const [value, setValue] = useState(pageSize);

  useEffect(() => {
    if (tableHash) {
      localStorage.setItem(fullHash, `${value}`);
    }
  }, [value]);

  return [value, setValue] as const;
};
