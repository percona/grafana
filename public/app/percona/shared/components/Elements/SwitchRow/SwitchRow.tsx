import { FC, ChangeEvent } from 'react';

import { Switch, useStyles2 } from '@grafana/ui';
import { LinkTooltip } from 'app/percona/shared/components/Elements/LinkTooltip/LinkTooltip';

import { getStyles } from './SwitchRow.styles';
import { SwitchRowProps } from './SwitchRow.types';

export const SwitchRow: FC<SwitchRowProps> = ({
  label,
  tooltip,
  tooltipLinkText = '',
  link = '',
  disabled,
  className,
  dataTestId,
  input,
  onChange,
}) => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.advancedRow} data-testid={dataTestId}>
      <div className={styles.advancedCol}>
        <div className={styles.labelWrapper}>
          <span>{label}</span>
          {!!tooltip && (
            <LinkTooltip tooltipContent={tooltip} link={link} linkText={tooltipLinkText} icon="info-circle" />
          )}
        </div>
      </div>
      <div className={className}>
        <Switch
          {...input}
          checked={undefined}
          value={input.checked}
          disabled={disabled}
          {...(onChange ? { onChange: (event: ChangeEvent) => onChange(event, input) } : {})}
        />
      </div>
    </div>
  );
};
