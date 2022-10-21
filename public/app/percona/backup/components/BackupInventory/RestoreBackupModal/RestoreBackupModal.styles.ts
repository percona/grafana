import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { palette, typography, spacing } }: GrafanaTheme2) => ({
  modalWrapper: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    align-items: center;
    gap: 0px ${spacing.sm};
    & > div {
      height: 100%;
    }
  `,
  radioGroup: css`
    & input[type='radio'] + label {
      height: auto;
      white-space: nowrap;
      padding: 7px 8px;
      line-height: ${typography.lineHeight.md};
    }
  `,
  errorLine: css`
    color: ${palette.redBase};
    font-size: ${typography.size.sm};
    height: ${typography.size.sm};
    line-height: ${typography.lineHeight.sm};
    margin-top: ${spacing.sm};
    padding: ${spacing.formLabelPadding};
    text-align: center;
  `,
});
