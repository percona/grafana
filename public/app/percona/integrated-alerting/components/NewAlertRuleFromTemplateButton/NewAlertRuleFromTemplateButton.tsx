import { FC } from 'react';

import { Trans } from '@grafana/i18n';
import { ComponentSize, LinkButton } from '@grafana/ui';
import { createReturnTo } from 'app/features/alerting/unified/hooks/useReturnTo';
import { createRelativeUrl } from 'app/features/alerting/unified/utils/url';
import { usePerconaAlertingEnabled } from 'app/percona/integrated-alerting/hooks';

interface NewAlertRuleFromTemplateButtonProps {
  size?: ComponentSize;
}

export const NewAlertRuleFromTemplateButton: FC<NewAlertRuleFromTemplateButtonProps> = ({ size }) => {
  const perconaAlertingEnabled = usePerconaAlertingEnabled();

  if (!perconaAlertingEnabled) {
    return null;
  }

  return (
    <LinkButton
      variant="primary"
      icon="plus"
      size={size}
      href={createRelativeUrl('/alerting/new-from-template', { returnTo: createReturnTo() })}
    >
      <Trans i18nKey="alerting.rule-list.new-alert-rule-from-template">New alert rule from template</Trans>
    </LinkButton>
  );
};
