import { logger } from '@percona/platform-core';
import React, { FC, useEffect, useRef, useState, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { SelectableValue } from '@grafana/data';
import { Field, Input, MultiSelect, Select } from '@grafana/ui';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
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
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<RuleFormValues>();
  const [templateOptions, setTemplateOptions] = useState<Array<SelectableValue<Template>>>();
  const [channelsOptions, setChannelsOptions] = useState<Array<SelectableValue<string>>>();
  const templates = useRef<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template>();
  const [queryParams] = useQueryParams();
  /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */
  const selectedTemplate: string | null = (queryParams['template'] as string | undefined) || null;

  const handleTemplateChange = useCallback(
    (selectedTemplate?: Template, onChange?: (template?: Template) => void) => {
      const newTemplate = templates.current.find((template) => template.name === selectedTemplate?.name);
      const newDuration = newTemplate?.for;
      const severityStr = newTemplate?.severity;
      const newSeverity = SEVERITY_OPTIONS.find((severity) => severity.value === severityStr);

      setCurrentTemplate(newTemplate);
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

      if (!!onChange) {
        onChange(selectedTemplate);
      }
    },
    [setValue]
  );

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

      if (selectedTemplate) {
        const matchingTemplate = templates.current.find((template) => template.name === selectedTemplate);

        if (matchingTemplate) {
          setValue('template', matchingTemplate);
          handleTemplateChange(matchingTemplate);
        }
      }
    } catch (e) {
      logger.error(e);
    }
  }, [handleTemplateChange, selectedTemplate, setValue]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <RuleEditorSection stepNo={2} title="Template details">
      <Field
        label={Messages.templateField}
        description={Messages.tooltips.template}
        error={errors.template?.message}
        invalid={!!errors.template?.message}
      >
        <Controller
          name="template"
          rules={{ required: { value: true, message: Messages.errors.template } }}
          render={({ field: { value, onChange } }) => (
            <Select
              id="template"
              value={templateOptions?.find((opt) => opt.value?.name === value?.name)}
              onChange={(selectedTemplate) => handleTemplateChange(selectedTemplate.value, onChange)}
              options={templateOptions}
              data-testid="template-select-input"
            />
          )}
        />
      </Field>
      <Field
        label={Messages.nameField}
        description={Messages.tooltips.name}
        error={errors.name?.message}
        invalid={!!errors.name?.message}
      >
        <Input id="name" {...register('name', { required: { value: true, message: Messages.errors.name } })} />
      </Field>

      {/* TODO add remaining params as API starts supporting them
      https://github.com/percona/pmm-managed/blob/PMM-2.0/models/template_model.go#L112 */}
      {currentTemplate?.params?.map(
        ({ float, type, name, summary, unit }) =>
          type === TemplateParamType.FLOAT && (
            <Field
              key={name}
              label={`${name[0].toUpperCase()}${name.slice(1)}`}
              description={Messages.getFloatDescription(summary, unit, float)}
              // @ts-ignore
              error={errors[name]?.message}
              // @ts-ignore
              invalid={!!errors[name]?.message}
            >
              <Input
                type="number"
                // @ts-ignore
                {...register(name, {
                  required: { value: true, message: Messages.errors.floatParamRequired(name) },
                  min: float?.hasMin
                    ? { value: float.min || 0, message: Messages.errors.floatParamMin(float.min || 0) }
                    : undefined,
                  max: float?.hasMax
                    ? { value: float.max || 0, message: Messages.errors.floatParamMax(float.max || 0) }
                    : undefined,
                })}
                name={name}
                defaultValue={`${float?.default}`}
              />
            </Field>
          )
      )}

      <Field
        label={Messages.durationField}
        description={Messages.tooltips.duration}
        error={errors.duration?.message}
        invalid={!!errors.duration?.message}
      >
        <Input
          type="number"
          id="duration"
          {...register('duration', {
            required: { value: true, message: Messages.errors.durationRequired },
            min: { value: MINIMUM_DURATION_VALUE, message: Messages.errors.durationMin(MINIMUM_DURATION_VALUE) },
          })}
        />
      </Field>
      <Field
        label={Messages.severityField}
        description={Messages.tooltips.severity}
        error={errors.severity?.message}
        invalid={!!errors.severity?.message}
      >
        <Controller
          name="severity"
          rules={{ required: { value: true, message: Messages.errors.severity } }}
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
