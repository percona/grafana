import { FC, useState } from 'react';

import { Collapse, useStyles } from '@grafana/ui';
import { Label } from 'app/percona/shared/components/Form/Label';

import { Messages } from '../TemplateForm.messages';

import { getStyles } from './AdvancedRuleSection.styles';
import { AdvancedRuleSectionProps } from './AdvancedRuleSection.types';

export const AdvancedRuleSection: FC<AdvancedRuleSectionProps> = ({
  expression,
  summary,
  queries = [],
  expressions = [],
  condition,
}) => {
  const styles = useStyles(getStyles);
  const [isAdvancedSectionOpen, setIsAdvancedSectionOpen] = useState(false);

  return (
    <div data-testid="alert-rule-advanced-section">
      <Collapse
        label={Messages.advanced}
        collapsible
        isOpen={isAdvancedSectionOpen}
        onToggle={() => setIsAdvancedSectionOpen((open) => !open)}
      >
        {queries.length > 0 && (
          <div data-testid="template-queries" className={styles.templateParsedField}>
            <Label label={Messages.templateQueries} />
            {queries.map((query) => (
              <div
                key={query.ref_id}
                data-testid={'template-query-' + query.ref_id}
                className={styles.templateParsedField}
              >
                <Label label={query.ref_id + ':'} />
                <pre>{query.expr}</pre>
              </div>
            ))}
          </div>
        )}
        {expressions.length > 0 && (
          <div data-testid="template-expressions" className={styles.templateParsedField}>
            <Label label={Messages.templateExpressions} />
            {expressions.map((expression) => (
              <div
                key={expression.ref_id}
                data-testid={'template-expression-' + expression.ref_id}
                className={styles.templateParsedField}
              >
                <Label label={expression.ref_id + ':'} />
                <pre>{expression.expression}</pre>
              </div>
            ))}
          </div>
        )}
        {condition && (
          <div data-testid="template-condition" className={styles.templateParsedField}>
            <Label label={Messages.templateCondition} />
            <pre>{condition}</pre>
          </div>
        )}
        {!expressions.length && (
          <div data-testid="template-expression" className={styles.templateParsedField}>
            <Label label={Messages.templateExpression} />
            <pre>{expression}</pre>
          </div>
        )}
        {summary && (
          <div data-testid="template-alert" className={styles.templateParsedField}>
            <Label label={Messages.ruleAlert} />
            <pre>{summary}</pre>
          </div>
        )}
      </Collapse>
    </div>
  );
};
