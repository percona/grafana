import { cx } from '@emotion/css';
import React, { useState } from 'react';
import { Field } from 'react-final-form';

import { Card, useStyles2 } from '@grafana/ui';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { BackupType } from 'app/percona/backup/Backup.types';

import { Messages } from '../AddBackupPage.messages';

import { Messages as PageSwitcherMessages } from './PageSwitcherCard.messages';
import { getStyles } from './PageSwitcherCard.styles';
import { PageSwitcherProps } from './PageSwitcherCard.types';

export const PageSwitcherCard = ({ scheduleMode, editing, setModalTitle }: PageSwitcherProps) => {
  const styles = useStyles2(getStyles);
  const [, setQueryParams] = useQueryParams();
  const [selected, setSelected] = useState({ onDemand: !scheduleMode, scheduled: scheduleMode });
  const cardStyles = cx({
    [styles.wrapper]: true,
    [styles.disabled]: false,
  });

  return (
    <div className={styles.pageSwitcherWrapper}>
      <Field name="type" component="input" type="radio" value={BackupType.DEMAND}>
        {({ input }) => (
          <Card
            className={cardStyles}
            isSelected={selected.onDemand}
            onClick={(e) => {
              e.preventDefault();
              input.onChange({ target: { value: input.value } });
              setSelected({ onDemand: true, scheduled: false });
              setQueryParams({ scheduled: null });
              setModalTitle(Messages.getModalTitle(false, editing));
            }}
          >
            <Card.Heading>{Messages.onDemand}</Card.Heading>
            <Card.Description>{PageSwitcherMessages.backupDescription}</Card.Description>
          </Card>
        )}
      </Field>
      <Field name="type" component="input" type="radio" value={BackupType.SCHEDULED}>
        {({ input }) => (
          <Card
            className={cardStyles}
            isSelected={selected.scheduled}
            onClick={(e) => {
              e.preventDefault();
              input.onChange({ target: { value: input.value } });
              setSelected({ onDemand: false, scheduled: true });
              setQueryParams({ scheduled: true });
              setModalTitle(Messages.getModalTitle(true, editing));
            }}
          >
            <Card.Heading> {Messages.schedule}</Card.Heading>
            <Card.Description>{PageSwitcherMessages.scheduleBackupDescription}</Card.Description>
          </Card>
        )}
      </Field>
    </div>
  );
};
