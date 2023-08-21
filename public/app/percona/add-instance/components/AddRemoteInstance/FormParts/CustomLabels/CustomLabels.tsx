import React, { FC, useMemo, useState } from 'react';
import { useField } from 'react-final-form';

import { getDataSourceSrv } from '@grafana/runtime';
import { PrometheusDatasource } from 'app/plugins/datasource/prometheus/datasource';
import { promQueryModeller } from 'app/plugins/datasource/prometheus/querybuilder/PromQueryModeller';
import { PromQueryBuilder } from 'app/plugins/datasource/prometheus/querybuilder/components/PromQueryBuilder';
import { buildVisualQueryFromString } from 'app/plugins/datasource/prometheus/querybuilder/parsing';
import { PromVisualQuery } from 'app/plugins/datasource/prometheus/querybuilder/types';
import { PromQuery } from 'app/plugins/datasource/prometheus/types';

import { styles } from './CustomLabels.styles';

const CustomLabels: FC = () => {
  const { input } = useField('custom_labels');
  const source = getDataSourceSrv().getInstanceSettings();
  const datasource = source ? new PrometheusDatasource(source) : undefined;
  const [query, setQuery] = useState<PromQuery>({
    refId: '',
    expr: input.value,
  });
  const visualQuery = useMemo(() => buildVisualQueryFromString(query.expr).query, [query.expr]);

  if (!datasource) {
    return null;
  }

  const handleQueryChange = (visualQuery: PromVisualQuery) => {
    const expr = promQueryModeller.renderQuery(visualQuery);
    const labels = visualQuery.labels;

    input.onChange(labels.map(({ label, value }) => label + ':' + value).join('\n'));

    setQuery((prev) => ({ ...prev, expr: expr || '' }));
  };

  return (
    <div className={styles.QueryBuilder}>
      <PromQueryBuilder
        datasource={datasource}
        onChange={handleQueryChange}
        onRunQuery={console.log}
        query={visualQuery}
        showExplain={false}
        hideMetric
        hideOperations
      />
    </div>
  );
};

export default CustomLabels;
