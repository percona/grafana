import moment from 'moment/moment';

import { DATASOURCE_BADGE_COLOR_MAP, DATASOURCE_MAP, UNIT_MAP, SOURCE_MAP } from './AlertRuleTemplate.constants';
import {
  FormattedTemplate,
  SourceDescription,
  Template,
  TemplateDatasourceType,
  TemplateExpression,
  TemplateParamUnit,
} from './AlertRuleTemplate.types';

export const formatTemplate = (template: Template): FormattedTemplate => {
  const { summary, source, created_at, ...restProps } = template;

  return {
    summary,
    source,
    created_at: created_at ? moment(created_at).format('YYYY-MM-DD HH:mm:ss') : undefined,
    ...restProps,
  };
};

export const formatTemplates = (templates: Template[]): FormattedTemplate[] => templates.map(formatTemplate);

export const beautifyUnit = (unit: TemplateParamUnit) => UNIT_MAP[unit];

export const formatSource = (source: SourceDescription) => SOURCE_MAP[source];

// Older servers don't send a datasource; their queries are all Metrics.
export const formatDatasource = (datasource = TemplateDatasourceType.METRICS) => DATASOURCE_MAP[datasource];

export const getDatasourceBadgeColor = (datasource = TemplateDatasourceType.METRICS) =>
  DATASOURCE_BADGE_COLOR_MAP[datasource];

export const formatDate = (date: string | undefined) => date && moment(date).format('YYYY-MM-DD');

export const isDynamicTemplate = (template: Template | FormattedTemplate) =>
  template.params?.some((p) => p.overridable);

export const usesClickHouse = (template?: Template) =>
  template?.queries?.some((query) => query.datasource === TemplateDatasourceType.CLICKHOUSE) ?? false;

export const formatExpression = (expression: TemplateExpression) =>
  expression.type === 'reduce' && expression.reducer
    ? `reduce(${expression.reducer}): ${expression.expression}`
    : expression.expression;
