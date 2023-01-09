import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme2) => ({
  optionsWrapper: css`
    margin-top: ${spacing(3)};
    max-width: 720px;
  `,

  collapsableSection: css`
    max-width: 170px;
    margin: ${spacing(6)} 0 ${spacing(3)} 0;
  `,
});
