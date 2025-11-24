import { css } from '@emotion/css';
import { FC } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Icon, TextLink, useStyles2 } from '@grafana/ui';

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  }),
  heading: css({
    marginBottom: theme.spacing(2),
  }),
  paragraph: css({
    marginTop: theme.spacing(2),
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.secondary,
  }),
});

export const AlertsEmptyState: FC = () => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        <Icon name="check-circle" size="xxl" /> No alerts detected
      </h1>
      <p className={styles.paragraph}>
        Use{' '}
        <TextLink href="/alerting/alert-rule-templates" inline>
          Alert rule templates
        </TextLink>
        , custom made by our database experts, for a faster start, and configure how you want to receive them at{' '}
        <TextLink href="/alerting/list" inline>
          Alert rules
        </TextLink>
        .
      </p>
      <p className={styles.paragraph}>
        For more information please visit our{' '}
        <TextLink
          href="https://docs.percona.com/percona-monitoring-and-management/get-started/alerting.html"
          external
          inline
        >
          Percona Alerting documentation page
        </TextLink>
        .
      </p>
    </div>
  );
};
