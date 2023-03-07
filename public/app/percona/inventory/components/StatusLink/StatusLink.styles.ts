import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ visualization }: GrafanaTheme2, badAgents: boolean) => ({
  link: css`
    text-decoration: underline;
    color: ${badAgents ? visualization.getColorByName('red') : visualization.getColorByName('green')};
  `,
});
