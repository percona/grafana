import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
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
