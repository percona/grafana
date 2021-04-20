import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ colors, typography, spacing }: GrafanaTheme) => ({
  select: css`
    margin-bottom: ${spacing.xl};
    div[class$='-input-wrapper'] {
      padding: 7px 8px;
    }
  `,
  actionsWrapper: css`
    margin-top: 60px;
  `,
  form: css`
    width: 100%;
  `,
  templateParsedField: css`
    margin-bottom: ${spacing.formInputMargin};
  `,
});
