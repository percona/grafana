import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
  booleanField: css({
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  }),
});
