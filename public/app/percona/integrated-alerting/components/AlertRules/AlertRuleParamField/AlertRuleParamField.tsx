import React, { FC } from 'react';

import { Field, Input } from '@grafana/ui';

import { TemplateParamType } from '../../AlertRuleTemplate/AlertRuleTemplate.types';

import { Messages } from './AlertRuleParamField.messages';
import { AlertRuleParamFieldProps } from './AlertRuleParamField.types';

export const AlertRuleParamField: FC<AlertRuleParamFieldProps> = ({ param }) => {
  const { name, type, unit, summary, float } = param;

  // TODO add remaining params as API starts supporting them
  // https://github.com/percona/pmm-managed/blob/PMM-2.0/models/template_model.go#L112
  const componentMap: Record<TemplateParamType, JSX.Element | null> = {
    [TemplateParamType.FLOAT]: (
      <Field label={Messages.getFloatDescription(name, summary, unit, float)}>
        <Input
          name={name}
          defaultValue={`${float?.default}`}
          min={float?.hasMin ? float.min : undefined}
          max={float?.hasMax ? float.max : undefined}
        />
      </Field>
    ),
    [TemplateParamType.BOOL]: null,
    [TemplateParamType.STRING]: null,
  };

  return componentMap[type];
};
