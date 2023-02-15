import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

import { ISOTimestamp } from './types';

export const formatDateWithTime = (timestamp: ISOTimestamp) => {
  const date = new Date(timestamp);
  return format(new Date(date).valueOf() + date.getTimezoneOffset() * 60 * 1000, 'MMMM dd, H:mm', { locale: enUS });
};

export const formatDateWithYear = (timestamp: ISOTimestamp) => {
  const date = new Date(timestamp);
  return format(new Date(date).valueOf() + date.getTimezoneOffset() * 60 * 1000, 'MMMM dd, yyyy', { locale: enUS });
};
