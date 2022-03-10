import { logger } from '@percona/platform-core';
import { SHOW_SILENCED_VALUE_KEY, SHOW_SILENCED_DEFAULT } from './FailedChecksTab.constants';

export const loadShowSilencedValue = (): boolean => {
  try {
    const showSilencedValue = window.localStorage.getItem(SHOW_SILENCED_VALUE_KEY);

    if (showSilencedValue === null) {
      return SHOW_SILENCED_DEFAULT;
    }

    return showSilencedValue === 'true';
  } catch (e) {
    logger.error(e);

    return SHOW_SILENCED_DEFAULT;
  }
};

export const saveShowSilencedValue = (value: boolean) => {
  try {
    window.localStorage.setItem(SHOW_SILENCED_VALUE_KEY, `${value}`);
  } catch (e) {
    logger.error(e);
  }
};

export const stripServiceId = (serviceId: string) => {
  const regex = /\/service_id\/(.*)/gm;
  const match = regex.exec(serviceId);

  if (match !== null) {
    return match[1] || '';
  }

  return '';
};

export const formatServiceId = (serviceId: string) => `/service_id/${serviceId}`;
