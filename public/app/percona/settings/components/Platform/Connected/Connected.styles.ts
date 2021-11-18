import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';
import { stylesFactory } from '@grafana/ui';

export const getStyles = stylesFactory(({ colors, typography, spacing }: GrafanaTheme) => ({
  wrapper: css`
    max-width: 500px;
  `,
  title: css`
    color: ${colors.formLabel};
    font-size: ${typography.heading.h3};
    font-weight: ${typography.weight.regular};
    margin: ${spacing.formLabelMargin};
    margin-bottom: ${spacing.lg};
  `,
}));
