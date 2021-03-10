import { SourceDescription, FormattedTemplate, Template, TemplateParamUnit } from './AlertRuleTemplate.types';
import moment from 'moment/moment';

export const formatTemplate = (template: Template): FormattedTemplate => {
  const { summary, source, created_at, ...restProps } = template;

  return {
    summary,
    source: SourceDescription[source],
    created_at: created_at ? moment(created_at).format('YYYY-MM-DD HH:mm:ss') : undefined,
    ...restProps,
  };
};

export const formatTemplates = (templates: Template[]): FormattedTemplate[] => templates.map(formatTemplate);

export const beautifyUnit = (unit: TemplateParamUnit) => {
  const unitMap: Record<TemplateParamUnit, string> = {
    [TemplateParamUnit.PERCENTAGE]: '%',
    [TemplateParamUnit.SECONDS]: 'seconds',
  };

  return unitMap[unit];
};
