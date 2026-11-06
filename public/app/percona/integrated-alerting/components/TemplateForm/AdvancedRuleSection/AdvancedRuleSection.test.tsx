import { fireEvent, render, screen } from '@testing-library/react';

import {
  TemplateDatasourceType,
  TemplateExpression,
  TemplateQuery,
} from '../../AlertRuleTemplate/AlertRuleTemplate.types';

import { AdvancedRuleSection } from './AdvancedRuleSection';
import { AdvancedRuleSectionProps } from './AdvancedRuleSection.types';

const baseProps: AdvancedRuleSectionProps = {
  expression: '$A > 80',
  summary: 'CPU usage is too high',
  queries: [],
  expressions: [],
  condition: 'C',
};

// The section is collapsed by default; open it before asserting on its content.
const setup = (props: Partial<AdvancedRuleSectionProps> = {}) => {
  const result = render(<AdvancedRuleSection {...baseProps} {...props} />);
  fireEvent.click(screen.getByTestId('collapse-clickable'));
  return result;
};

describe('AdvancedRuleSection', () => {
  it('shows a datasource badge for each query', () => {
    const queries: TemplateQuery[] = [
      { ref_id: 'A', expr: 'SELECT * FROM queries', datasource: TemplateDatasourceType.CLICKHOUSE },
      { ref_id: 'B', expr: 'up', datasource: TemplateDatasourceType.METRICS },
    ];

    setup({ queries });

    expect(screen.getByTestId('template-query-A-datasource')).toHaveTextContent('ClickHouse');
    expect(screen.getByTestId('template-query-B-datasource')).toHaveTextContent('Metrics');
  });

  it('defaults the datasource badge to Metrics when the query has none', () => {
    setup({ queries: [{ ref_id: 'A', expr: 'up' }] });

    expect(screen.getByTestId('template-query-A-datasource')).toHaveTextContent('Metrics');
  });

  it.each<[TemplateExpression, string]>([
    [{ ref_id: 'B', type: 'reduce', reducer: 'max', expression: '$A' }, 'reduce(max): $A'],
    [{ ref_id: 'C', type: 'math', expression: '$B > 0' }, '$B > 0'],
  ])('renders expression %o as %s', (expression, expected) => {
    setup({ expressions: [expression] });

    expect(screen.getByTestId(`template-expression-${expression.ref_id}`)).toHaveTextContent(expected);
  });

  it('falls back to the single template expression when there are no parsed expressions', () => {
    setup({ expressions: [], expression: 'some_expr > 1' });

    expect(screen.queryByTestId('template-expressions')).not.toBeInTheDocument();
    expect(screen.getByTestId('template-expression')).toHaveTextContent('some_expr > 1');
  });
});
