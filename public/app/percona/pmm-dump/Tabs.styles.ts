import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { palette }, colors, spacing }: GrafanaTheme2) => ({
  detailsWrapper: css`
    display: flex;
    flex-direction: column;
  `,
  tagList: css`
    justify-content: flex-start;

    & > li {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `,
  actionPanel: css`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
  `,
  confirmationText: css`
    margin-bottom: 2em;
  `,
  emptyMessage: css`
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  overlay: css`
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
  `,
  actionItemTxtSpan: css`
    line-height: 15px;
  `,
  agentBreadcrumb: css`
    margin-top: ${spacing(4)};
    display: flex;

    span {
      white-space: pre;
    }

    & > span:first-child {
      max-width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
  goBack: css`
    vertical-align: middle;
  `,
  link: css`
    color: ${colors.text.link};
  `,
  createDatasetArea: css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  `,
  actionButton: css`
    background: none;
    margin-right: 7px;
  `,
  nodes: css`
    color: ${colors.text.disabled};
  `,
  logs: css`
    color: ${palette.blue77};
    text-decoration: underline;
    cursor: pointer;
  `,
});