import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import moment from 'moment/moment';
import { formatDataModel } from 'app/percona/backup/Backup.utils';
import { RestoreHistoryDetailsProps } from './RestoreHistoryDetails.types';
import { Messages } from './RestoreHistoryDetails.Messages';
import { getStyles } from './RestoreHistoryDetails.styles';
import { DAY_FORMAT, HOUR_FORMAT } from '../../DetailedDate/DetailedDate.constants';

export const RestoreHistoryDetails: FC<RestoreHistoryDetailsProps> = ({ name, finished, dataModel }) => {
  const styles = useStyles(getStyles);
  const dataModelMsg = formatDataModel(dataModel);
  const momentObj = moment(finished);
  const dayTime = momentObj.format(DAY_FORMAT);
  const hourTime = momentObj.format(HOUR_FORMAT);

  return (
    <div className={styles.detailsWrapper} data-qa="restore-details-wrapper">
      <span data-qa="restore-details-name">
        <span className={styles.detailLabel}>{Messages.backupName}</span> <span>{name}</span>
      </span>
      <span data-qa="restore-details-finished">
        <span className={styles.detailLabel}>{Messages.finished}</span>
        <span>{dayTime}</span>
        <span>{hourTime}</span>
      </span>
      <span data-qa="restore-details-data-model">
        <span className={styles.detailLabel}>{Messages.dataModel}</span> <span>{dataModelMsg}</span>
      </span>
    </div>
  );
};
