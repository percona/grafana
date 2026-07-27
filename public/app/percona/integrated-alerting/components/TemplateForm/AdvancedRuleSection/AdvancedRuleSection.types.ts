import { TemplateExpression, TemplateQuery } from '../../AlertRuleTemplate/AlertRuleTemplate.types';

export interface AdvancedRuleSectionProps {
  expression: string;
  summary?: string;
  queries: TemplateQuery[];
  expressions: TemplateExpression[];
  condition: string;
}
