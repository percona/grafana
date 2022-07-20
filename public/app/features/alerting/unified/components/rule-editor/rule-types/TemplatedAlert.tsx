import React, { FC } from 'react';

import { RuleFormType } from '../../../types/rule-form';

import { RuleType, SharedProps } from './RuleType';

const TemplatedAlertRuleType: FC<SharedProps> = ({ selected = false, disabled, onClick }) => {
  return (
    <RuleType
      name="Templated alert"
      description={<span>Use templated alerts for simplicity</span>}
      image="public/img/grafana_icon.svg"
      selected={selected}
      disabled={disabled}
      value={RuleFormType.percona}
      onClick={onClick}
    />
  );
};

export { TemplatedAlertRuleType };
