import { css } from '@emotion/css';

import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  fieldSetLabel: css`
    div {
     label:after{
       display: none;
     }
    },
    `,
});
