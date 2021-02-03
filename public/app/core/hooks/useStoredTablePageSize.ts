import { useEffect, useState } from 'react';
import { logger } from '@percona/platform-core';
import { SelectableValue } from '@grafana/data';

export const PAGE_SIZES: Array<SelectableValue<number>> = [
  {
    label: '25',
    value: 25,
  },
  {
    label: '50',
    value: 50,
  },
  {
    label: '100',
    value: 100,
  },
];

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
