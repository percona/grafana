import React, { FC } from 'react';
import { NumberInputField } from '@percona/platform-core';
import { TemplateParamType } from '../../AlertRuleTemplate/AlertRuleTemplate.types';
import { AlertRuleParamFieldProps } from './AlertRuleParamField.types';

export const AlertRuleParamField: FC<AlertRuleParamFieldProps> = ({ param }) => {
  const { name, type, float } = param;

  const componentMap: Record<TemplateParamType, JSX.Element | null> = {
    [TemplateParamType.FLOAT]: <NumberInputField name={name} label={name} initialValue={float?.default} />,
    [TemplateParamType.BOOL]: null,
    [TemplateParamType.STRING]: null,
  };

  return componentMap[type];
};
