import React, { FC } from 'react';
import { NumberInputField } from '@percona/platform-core';
import { TemplateParamType } from '../../AlertRuleTemplate/AlertRuleTemplate.types';
import { AlertRuleParamFieldProps } from './AlertRuleParamField.types';
import { Messages } from './AlertRuleParamField.messages';

export const AlertRuleParamField: FC<AlertRuleParamFieldProps> = ({ param }) => {
  const { name, type, unit, summary, float } = param;

  const componentMap: Record<TemplateParamType, JSX.Element | null> = {
    [TemplateParamType.FLOAT]: (
      <NumberInputField
        name={name}
        label={Messages.getFloatDescription(name, summary, unit, float)}
        defaultValue={float?.default}
      />
    ),
    [TemplateParamType.BOOL]: null,
    [TemplateParamType.STRING]: null,
  };

  return componentMap[type];
};
