import React, { FC } from 'react';
import { NumberInputField, validators } from '@percona/platform-core';
import { TemplateParamType } from '../../AlertRuleTemplate/AlertRuleTemplate.types';
import { AlertRuleParamFieldProps } from './AlertRuleParamField.types';
import { Messages } from './AlertRuleParamField.messages';
import { minValidator, maxValidator } from '../AddAlertRuleModal/AddAlertRuleModal.utils';

export const AlertRuleParamField: FC<AlertRuleParamFieldProps> = ({ param }) => {
  const { name, type, unit, summary, float } = param;
  const floatValidators: any[] = [validators.required];

  if (float?.has_min) {
    floatValidators.push(minValidator(float.min || 0));
  }

  if (float?.has_max) {
    floatValidators.push(maxValidator(float.max));
  }

  // TODO add remaining params as API starts supporting them
  const componentMap: Record<TemplateParamType, JSX.Element | null> = {
    [TemplateParamType.FLOAT]: (
      <NumberInputField
        name={name}
        label={Messages.getFloatDescription(name, summary, unit, float)}
        defaultValue={float?.default}
        validators={floatValidators}
      />
    ),
    [TemplateParamType.BOOL]: null,
    [TemplateParamType.STRING]: null,
  };

  return componentMap[type];
};
