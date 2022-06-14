import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { colors } }: GrafanaTheme2) => {
  return {
    filterWrapper: css`
      background-color: ${colors.bg2};
      border: 1px solid ${colors.border2};
      border-bottom: none;
      padding: 4px 16px;
      display: flex;
      justify-content: space-between;
    `,
    filterLabel: css`
      font-size: 20px;
    `,
    filterActionsWrapper: css`
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
    `,
    collapseClose: css`
      max-height: 0px;
      transition: max-height 0.5s ease-out;
    `,
    collapseOpen: css`
      max-height: 200px;
      transition: max-height 0.5s ease-in;
    `,
    collapseBody: css`
      padding: 4px 16px;
    `,
  };
};
