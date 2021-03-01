import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import moment from 'moment/moment';
import { BackupCreationProps } from './BackupCreation.types';
import { getStyles } from './BackupCreation.styles';

export const BackupCreation: FC<BackupCreationProps> = ({ date }) => {
  const styles = useStyles(getStyles);
  const momentObj = moment(date);
  const dayTime = momentObj.format('YYYY[-]MM[-]DD');
  const hourTime = momentObj.format('HH[:]mm[:]ss');

  return (
    <div>
      <span>{dayTime}</span>
      <span className={styles.hourWrapper}>{hourTime}</span>
    </div>
  );
};
