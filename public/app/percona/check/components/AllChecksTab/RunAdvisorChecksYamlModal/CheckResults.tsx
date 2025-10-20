import { FC } from 'react';

import { useStyles2 } from '@grafana/ui';
import { FormattedCheckResult } from 'app/percona/check/types';
import { Severity } from 'app/percona/integrated-alerting/components/Severity';

import { Messages } from './RunAdvisorChecksYamlModal.messages';
import { getStyles } from './RunAdvisorChecksYamlModal.styles';

interface CheckResultsProps {
  results: FormattedCheckResult[];
}

export const CheckResults: FC<CheckResultsProps> = ({ results }) => {
  const styles = useStyles2(getStyles);

  if (results.length === 0) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.noResults}>{Messages.noResults}</div>
      </div>
    );
  }

  return (
    <div className={styles.resultsContainer}>
      <h3 className={styles.resultsTitle}>{Messages.resultsTitle}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{Messages.table.checkName}</th>
            <th>{Messages.table.serviceName}</th>
            <th>{Messages.table.severity}</th>
            <th>{Messages.table.summary}</th>
            <th>{Messages.table.description}</th>
            <th>{Messages.table.silenced}</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={`${result.checkName}-${result.serviceId}-${index}`}>
              <td>{result.checkName}</td>
              <td>
                {result.serviceName}
                {result.serviceId && (
                  <div style={{ fontSize: '0.85em', opacity: 0.7 }}>
                    ID: {result.serviceId}
                  </div>
                )}
              </td>
              <td>
                <Severity severity={result.severity} />
              </td>
              <td>
                {result.summary}
                {result.readMoreUrl && (
                  <>
                    {' '}
                    <a href={result.readMoreUrl} target="_blank" rel="noopener noreferrer">
                      {Messages.table.readMore}
                    </a>
                  </>
                )}
              </td>
              <td>{result.description}</td>
              <td>{result.silenced ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
