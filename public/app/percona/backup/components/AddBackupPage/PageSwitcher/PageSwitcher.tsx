import { useStyles2 } from '@grafana/ui';
import { RadioButton } from '@percona/platform-core/dist/components/RadioButtonGroup/RadioButton';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { BackupType } from 'app/percona/backup/Backup.types';
import React from 'react';
import { Field } from 'react-final-form';
import { Messages } from '../AddBackupPage.messages';
import { getStyles } from './PageSwitcher.styles';
import { PageSwitcherProps } from './PageSwitcher.types';

export const PageSwitcher = ({ editing, setModalTitle }: PageSwitcherProps) => {
  const styles = useStyles2(getStyles);
  const [, setQueryParams] = useQueryParams();
  return (
    <div className={styles.pageSwitcherWrapper}>
      <Field name="type" component="input" type="radio" value={BackupType.DEMAND}>
        {({ input }) => (
          <RadioButton
            {...input}
            onChange={() => {
              setModalTitle(Messages.getModalTitle(false, editing));
              setQueryParams({ scheduled: null });
            }}
          >
            {Messages.onDemand}
          </RadioButton>
        )}
      </Field>
      <Field name="type" component="input" type="radio" value={BackupType.SCHEDULED}>
        {({ input }) => (
          <RadioButton
            {...input}
            onChange={() => {
              setModalTitle(Messages.getModalTitle(true, editing));
              setQueryParams({ scheduled: true });
            }}
          >
            {Messages.schedule}
          </RadioButton>
        )}
      </Field>
    </div>
  );
};
