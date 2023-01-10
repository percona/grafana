import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ typography, colors, v1: { spacing } }: GrafanaTheme2) => ({
  descriptionFilter: css`
    flex: 1 0 calc(100% - 2 * ${spacing.md});
  `,
  actionButtons: css`
    display: flex;
    flex: 1;
    justify-content: flex-end;
    padding-bottom: ${spacing.sm};
    align-items: center;
  `,
  runChecksButton: css`
    width: 140px;
    justify-content: center;
  `,
  collapsableSection: css`
    border: none;
    background-color: ${colors.background.primary};
  `,
  collapsableHeader: css`
    padding: 20px;
    width: 100%;
    background-color: ${colors.background.secondary};
  `,
  collapsableHeaderLabel: css`
    width: 100%;
  `,
  collapsableBody: css`
    padding: 2px 0 0 0;
  `,
  collapsableLabel: css`
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    width: 100%;
  `,
  mainLabel: css`
    font-weight: ${typography.fontWeightBold};
    font-size: ${typography.fontSize}px;
  `,
  label: css`
    font-size: ${typography.fontSize}px;
    font-weight: ${typography.fontWeightLight};
  `,
});
