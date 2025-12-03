import { FC } from 'react';

import { Icon, TextLink, useStyles2 } from '@grafana/ui';

import { Messages } from './AlertsEmptyState.messages';
import { getStyles } from './AlertsEmptyState.styles';

export const AlertsEmptyState: FC = () => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        <Icon name="check-circle" size="xxl" /> {Messages.heading}
      </h1>
      <p className={styles.paragraph}>
        Use{' '}
        <TextLink href="/alerting/alert-rule-templates" inline>
          {Messages.templateLink},{' '}
        </TextLink>{' '}
        {Messages.firstParagraph}{' '}
        <TextLink href="/alerting/list" inline>
          {Messages.alertRulesLink}
        </TextLink>
        .
      </p>
      <p className={styles.paragraph}>
        {Messages.secondParagraph}{' '}
        <TextLink href="https://per.co.na/alerting" external inline>
          {Messages.documentationLink}
        </TextLink>
        .
      </p>
    </div>
  );
};
