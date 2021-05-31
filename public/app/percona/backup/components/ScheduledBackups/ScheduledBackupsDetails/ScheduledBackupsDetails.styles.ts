import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ spacing, typography }: GrafanaTheme) => ({
  detailsWrapper: css`
    display: flex;
    align-items: center;

    & > * {
      flex: 1 0 calc(100% / 3);

      &:not(:last-child) {
        padding-right: ${spacing.md};
      }

      &:not(:first-child) {
        padding-left: ${spacing.md};
      }
    }
  `,
  detailLabel: css`
    margin-right: ${spacing.md};
    font-weight: ${typography.weight.semibold};
  `,
});
