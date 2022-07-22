import { logger } from '@percona/platform-core';
import React, { FC, useEffect, useRef, useState, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { SelectableValue } from '@grafana/data';
import { Field, Input, MultiSelect, Select } from '@grafana/ui';
import { AlertRuleTemplateService } from 'app/percona/integrated-alerting/components/AlertRuleTemplate/AlertRuleTemplate.service';
import {
  Template,
  TemplateParamType,
} from 'app/percona/integrated-alerting/components/AlertRuleTemplate/AlertRuleTemplate.types';

import { RuleFormValues } from '../../../types/rule-form';
import { RuleEditorSection } from '../RuleEditorSection';

import { AdvancedRuleSection } from './AdvancedRuleSection/AdvancedRuleSection';
import TemplateFiltersField from './TemplateFiltersField';
import { SEVERITY_OPTIONS, MINIMUM_DURATION_VALUE } from './TemplateStep.constants';
import { Messages } from './TemplateStep.messages';
import { AddAlertRuleModalService } from './TemplateStep.service';
import { formatChannelsOptions, formatTemplateOptions } from './TemplateStep.utils';

export const TemplateStep: FC = () => {
  const { register, setValue } = useFormContext<RuleFormValues>();
  const [templateOptions, setTemplateOptions] = useState<Array<SelectableValue<Template>>>();
  const [channelsOptions, setChannelsOptions] = useState<Array<SelectableValue<string>>>();
  const templates = useRef<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template>();

  const getData = useCallback(async () => {
    try {
      const [channelsListResponse, templatesListResponse] = await Promise.all([
        AddAlertRuleModalService.notificationList(),
        AlertRuleTemplateService.list({
          page_params: {
            index: 0,
            page_size: 100,
          },
        }),
      ]);
      setChannelsOptions(formatChannelsOptions(channelsListResponse));
      setTemplateOptions(formatTemplateOptions(templatesListResponse.templates));
      templates.current = templatesListResponse.templates;
    } catch (e) {
      logger.error(e);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleTemplateChange = (name = ''): Template | undefined => {
    const template = templates.current.find((template) => template.name === name);
    setCurrentTemplate(template);

    return template;
  };

  return (
    <RuleEditorSection stepNo={2} title="Template details">
      <Field label={Messages.templateField} description={Messages.tooltips.template}>
        <Controller
          name="template"
          render={({ field: { value, onChange } }) => (
            <Select
              id="template"
              value={templateOptions?.find((opt) => opt.value?.name === value?.name)}
              onChange={(selectedTemplate) => {
                const curTemplateData = templates.current.find(
                  (template) => template.name === selectedTemplate.value?.name
                );
                const newDuration = curTemplateData?.for;
                const severityStr = curTemplateData?.severity;
                const newSeverity = SEVERITY_OPTIONS.find((severity) => severity.value === severityStr);
                const newTemplate = handleTemplateChange(selectedTemplate.value?.name);

                if (newSeverity && newSeverity.value) {
                  // @ts-ignore
                  setValue('severity', newSeverity.value);
                }
                setValue('duration', parseInt(newDuration || '0', 10));

                if (newTemplate) {
                  newTemplate.params?.forEach(({ type, float, name }) => {
                    // TODO add missing types when supported
                    if (type === TemplateParamType.FLOAT && float?.default !== undefined) {
                      // @ts-ignore
                      setValue(name, float.default);
                    }
                  });
                }
                onChange(selectedTemplate.value);
              }}
              options={templateOptions}
              data-testid="template-select-input"
            />
          )}
        />
      </Field>
      <Field label={Messages.nameField} description={Messages.tooltips.name}>
        <Input id="name" {...register('name', { required: true })} />
      </Field>

      {/* TODO add remaining params as API starts supporting them
      https://github.com/percona/pmm-managed/blob/PMM-2.0/models/template_model.go#L112 */}
      {currentTemplate?.params?.map(
        ({ float, type, name, summary, unit }) =>
          type === TemplateParamType.FLOAT && (
            <Field label={Messages.getFloatDescription(name, summary, unit, float)}>
              <Input
                type="number"
                // @ts-ignore
                {...register(name, {
                  required: true,
                  min: float?.hasMin ? float.min : undefined,
                  max: float?.hasMax ? float.max : undefined,
                })}
                name={name}
                defaultValue={`${float?.default}`}
              />
            </Field>
          )
      )}

      <Field label={Messages.durationField} description={Messages.tooltips.duration}>
        <Input type="number" id="duration" {...register('duration', { required: true, min: MINIMUM_DURATION_VALUE })} />
      </Field>
      <Field label={Messages.severityField} description={Messages.tooltips.severity}>
        <Controller
          name="severity"
          render={({ field: { onChange, value } }) => (
            <Select
              value={value}
              onChange={(v) => onChange(v.value)}
              id="severity"
              options={SEVERITY_OPTIONS}
              data-testid="severity-select-input"
            />
          )}
        />
      </Field>

      <TemplateFiltersField />

      <Field label={Messages.channelField} description={Messages.tooltips.channels}>
        <Controller
          name="notificationChannels"
          render={({ field: { value, onChange } }) => (
            <MultiSelect
              id="notificationChannels"
              onChange={(e) => onChange(e.map((channel) => channel.value))}
              value={value}
              options={channelsOptions}
              data-testid="notificationChannels-multiselect-input"
            />
          )}
        />
      </Field>

      {currentTemplate && (
        <AdvancedRuleSection expression={currentTemplate.expr} summary={currentTemplate.annotations?.summary} />
      )}
    </RuleEditorSection>
  );
};
