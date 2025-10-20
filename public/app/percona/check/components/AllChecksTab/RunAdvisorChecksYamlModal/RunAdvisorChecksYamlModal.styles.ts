import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
  yamlTextarea: css`
    min-height: 250px;
    font-family: monospace;
  `,
  uploadAction: css`
    margin-bottom: ${theme.spacing(2)};
    svg {
      margin-right: ${theme.spacing(1)};
    }
  `,
  resultsContainer: css`
    margin-top: ${theme.spacing(3)};
    max-height: 400px;
    overflow-y: auto;
  `,
  resultsTitle: css`
    margin-bottom: ${theme.spacing(2)};
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  noResults: css`
    padding: ${theme.spacing(2)};
    text-align: center;
    color: ${theme.colors.text.secondary};
  `,
  table: css`
    width: 100%;
    border-collapse: collapse;

    th, td {
      padding: ${theme.spacing(1)};
      text-align: left;
      border-bottom: 1px solid ${theme.colors.border.weak};
    }

    th {
      background-color: ${theme.colors.background.secondary};
      font-weight: ${theme.typography.fontWeightMedium};
    }

    tr:hover {
      background-color: ${theme.colors.emphasize(theme.colors.background.primary, 0.03)};
    }
  `,
  severityBadge: css`
    padding: ${theme.spacing(0.5, 1)};
    border-radius: ${theme.shape.radius.default};
    font-size: ${theme.typography.bodySmall.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    display: inline-block;
  `,
  buttonGroup: css`
    margin-top: ${theme.spacing(2)};
  `,
});
