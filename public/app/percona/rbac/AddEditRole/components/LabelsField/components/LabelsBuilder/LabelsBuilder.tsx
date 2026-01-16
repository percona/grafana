import { FC, useMemo } from 'react';

import { MetricsLabelsSection, PromQuery, PrometheusDatasource, QueryPreview } from '@grafana/prometheus';
import { buildVisualQueryFromString } from '@grafana/prometheus/src/querybuilder/parsing';
import { PromVisualQuery } from '@grafana/prometheus/src/querybuilder/types';
import { getDataSourceSrv } from '@grafana/runtime';
import { promQueryModeller } from '@grafana/prometheus/src/querybuilder/shared/modeller_instance';

import { styles } from './LabelsBuilder.styles';
import { getDefaultTimeRange } from '@grafana/data';

interface LabelsBuilderProps {
  value: string;
  onChange: (value: string) => void;
}

const LabelsBuilder: FC<LabelsBuilderProps> = ({ value, onChange }) => {
  const source = getDataSourceSrv().getInstanceSettings();
  const timeRange = getDefaultTimeRange();
  const datasource = source ? new PrometheusDatasource(source) : undefined;
  const query = useMemo<PromQuery>(() => ({ refId: '', expr: value }), [value]);
  const visualQuery = useMemo(() => buildVisualQueryFromString(query.expr).query, [query.expr]);

  if (!datasource) {
    return null;
  }

  const handleQueryChange = (visualQuery: PromVisualQuery) => {
    const expr = promQueryModeller.renderQuery(visualQuery);
    onChange(expr);
  };

  return (
    <div className={styles.QueryBuilder} data-testid="test">
      <MetricsLabelsSection
        datasource={datasource}
        onChange={handleQueryChange}
        query={visualQuery}
        timeRange={timeRange}
      />
      <div />
      {query.expr && <QueryPreview query={query.expr} />}
    </div>
  );
};

export default LabelsBuilder;
