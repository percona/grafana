import { getPerconaSettings } from 'app/percona/shared/core/selectors';
import { useSelector } from 'app/types/store';

export const usePerconaAlertingEnabled = (): boolean => {
  const { result: settings } = useSelector(getPerconaSettings);

  return !!settings?.alertingEnabled;
};
