import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { palette, colors, spacing }, colors: v2Colors }: GrafanaTheme2) => {
  const cellPadding = 16;

  return {
    actionsWrapper: css`
      display: flex;
      justify-content: flex-end;
      margin-bottom: ${spacing.sm};
    `,
    filtersWrapper: css`
      padding: 5px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin: 0 -${cellPadding}px;
    `,
    filter: css`
      background-color: ${colors.bg3};
      border-radius: 8px;
      padding: 6px;
      line-height: 1;
      margin: 5px;
    `,
    lastNotifiedWrapper: css`
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    `,
    lastNotifiedDate: css`
      flex: 1;
    `,
    lastNotifiedCircle: css`
      border-radius: 50%;
      background-color: ${palette.red};
      margin-left: 10px;
      height: 16px;
      width: 16px;
    `,
    nameWrapper: css`
      display: flex;
      justify-content: space-between;
    `,
    details: css`
      margin-top: ${spacing.md};
    `,
    disabledRow: css`
      background-color: ${colors.dashboardBg} !important;
    `,
    highlightedRow: css`
      background-color: ${v2Colors.action.selected} !important;
    `,
  };
};
