import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getDeprecationTooltipStyles = (theme: GrafanaTheme2) => ({
  link: css({
    color: theme.colors.text.link,
    cursor: 'pointer',
    fontWeight: theme.typography.fontWeightMedium,
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
    '&:hover': {
      color: theme.colors.emphasize(theme.colors.text.link, 0.08),
    },
  }),
});

export const styles = {
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
    flex: 1;
    justify-content: center;
  `,
};
