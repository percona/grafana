export const ALERT_RULE_TEMPLATES_TABLE_ID = 'alert-rule-templates';
import { SourceDescription, TemplateDatasourceType, TemplateParamUnit } from './AlertRuleTemplate.types';

export const UNIT_MAP: Record<TemplateParamUnit, string> = {
  [TemplateParamUnit.PERCENTAGE]: '%',
  [TemplateParamUnit.SECONDS]: 'seconds',
};

export const SOURCE_MAP: Record<SourceDescription, string> = {
  [SourceDescription.BUILT_IN]: 'Built-in',
  [SourceDescription.USER_FILE]: 'User Created (file)',
  [SourceDescription.USER_API]: 'User Created (UI)',
};

export const DATASOURCE_MAP: Record<TemplateDatasourceType, string> = {
  [TemplateDatasourceType.UNSPECIFIED]: 'Metrics',
  [TemplateDatasourceType.METRICS]: 'Metrics',
  [TemplateDatasourceType.CLICKHOUSE]: 'ClickHouse',
};

export const GET_TEMPLATES_CANCEL_TOKEN = 'getTemplates';
