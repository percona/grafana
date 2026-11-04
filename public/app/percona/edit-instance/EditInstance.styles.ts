import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
  link: css`
    color: ${theme.colors.text.link};
  `,
  hidden: css`
    display: none;
  `,
  groupWrapper: css`
    width: ${theme.breakpoints.values.md}px;
  `,
  sectionHeader: css`
    margin-top: 15px;
    margin-bottom: 15px;
  `,
  group: css`
    display: flex;
    flex-direction: row;
    gap: ${theme.spacing(2)};

    ${theme.breakpoints.down('md')} {
      flex-wrap: wrap;
    }

    & > * {
      width: 50%;
      margin-bottom: ${theme.spacing(1)} !important;
    }
  `,
  description: css`
    color: ${theme.colors.text.secondary};
    font-weight: normal;
    margin-bottom: 0;
    text-wrap: auto;
  `,
});
