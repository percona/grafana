import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
  panel: css`
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;

    p {
      margin-bottom: 0;
    }

    @media (max-width: 1281px) {
      #pmm-update-widget h2 {
        font-size: 1.55rem;
        margin-bottom: 0.1rem;
      }
    }
  `,
  middleSectionWrapper: css`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
  `,
  notAvailable: css`
    margin-top: ${theme.spacing(1)};
    color: ${theme.colors.text.secondary};
  `,
  link: css`
    color: ${theme.colors.text.link};
  `,
});
