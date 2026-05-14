import { useMemo, useRef } from 'react';

import { SelectableValue } from '@grafana/data';

import { BackupRow } from './BackupInventory.types';

/**
 * Custom hook to extract and memoize service names from backup data.
 * Only updates when the actual service names change, not on every data refresh.
 * This prevents unnecessary column recalculation and preserves component state.
 */
export const useServiceNames = (data: BackupRow[]): Array<SelectableValue<string>> => {
  // Extract service names as a stable string key for comparison
  const serviceNamesKey = useMemo(() => {
    const uniqueServiceNames = Array.from(new Set(data.map((item) => item.serviceName))).sort();
    return uniqueServiceNames.join(',');
  }, [data]);

  const serviceNamesRef = useRef<{ key: string; names: Array<SelectableValue<string>> }>({ key: '', names: [] });

  const serviceNames = useMemo<Array<SelectableValue<string>>>(() => {
    // Only update if service names actually changed
    if (serviceNamesRef.current.key !== serviceNamesKey) {
      const uniqueServiceNames = serviceNamesKey ? serviceNamesKey.split(',') : [];
      serviceNamesRef.current = {
        key: serviceNamesKey,
        names: uniqueServiceNames.map((serviceName) => ({
          label: serviceName,
          value: serviceName,
        })),
      };
    }

    return serviceNamesRef.current.names;
  }, [serviceNamesKey]);

  return serviceNames;
};
