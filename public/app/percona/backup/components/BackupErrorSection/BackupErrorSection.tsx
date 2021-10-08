import { Card, useStyles } from '@grafana/ui';
import React, { FC } from 'react';
import { BackupErrorSectionProps } from './BackupErrorSection.types';
import { Messages } from './BackupErrorSection.messages';
import { getStyles } from './BackupErrorSection.styles';

export const BackupErrorSection: FC<BackupErrorSectionProps> = ({ backupErrors = [] }) => {
  const styles = useStyles(getStyles);

  return (
    <Card heading={Messages.problemOcurred} className={styles.apiErrorSection}>
      <Card.Meta separator="">
        <section data-testid="backup-errors">
          {backupErrors.map((error) => (
            <div key={error.message}>
              {error.message}{' '}
              <a href={error.link} rel="noreferrer" target="_blank">
                {Messages.readMore}
              </a>
            </div>
          ))}
        </section>
      </Card.Meta>
    </Card>
  );
};
