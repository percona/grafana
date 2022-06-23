import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { colors } }: GrafanaTheme2) => {
  return {
    searchSelect: css`
      margin: 0;
    `,
    searchTextInput: css`
      margin: 0;
    `,
    filterWrapper: css`
      background-color: ${colors.bg2};
      border: 2px solid ${colors.border2};
      border-bottom: none;
      padding: 2px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    filterLabel: css`
      font-size: 20px;
    `,
    filterActionsWrapper: css`
      display: flex;
      justify-content: right;
      align-items: center;
      gap: 5px;
      width: 33%;
    `,
    collapseClose: css`
      max-height: 0;
      transition: max-height 0.5s ease-out;
      overflow: hidden;
    `,
    collapseOpen: css`
      max-height: fit-content;
      transition: max-height 0.5s ease-in;
    `,
    advanceFilter: css`
      border-top: 2px solid ${colors.border2};
      padding: 16px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
    `,
    searchFields: css`
      display: flex;
      gap: 10px;
      width: 100%;
    `,
    icon: css`
      margin-top: 5px;
      margin-bottom: 5px;
    `,
  };
};
