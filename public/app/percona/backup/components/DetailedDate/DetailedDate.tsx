import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import moment from 'moment/moment';
import { DetailedDateProps } from './DetailedDate.types';
import { getStyles } from './DetailedDate.styles';
import { DAY_FORMAT, HOUR_FORMAT } from './DetailedDate.constants';

export const DetailedDate: FC<DetailedDateProps> = ({ date }) => {
  const styles = useStyles(getStyles);
  const momentObj = moment(date);
  const dayTime = momentObj.format(DAY_FORMAT);
  const hourTime = momentObj.format(HOUR_FORMAT);

  return (
    <div data-qa="detailed-date">
      <span>{dayTime}</span>
      <span className={styles.hourWrapper}>{hourTime}</span>
    </div>
  );
};
