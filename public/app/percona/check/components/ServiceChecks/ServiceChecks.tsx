import React, { FC, useEffect, useCallback, useState, useMemo } from 'react';
import { useStyles2 } from '@grafana/ui';
import { logger, Chip } from '@percona/platform-core';
import { Column } from 'react-table';
import { GrafanaRouteComponentProps } from 'app/core/navigation/types';
import PageWrapper from 'app/percona/shared/components/PageWrapper/PageWrapper';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { useStoredTablePageSize } from 'app/percona/integrated-alerting/components/Table/Pagination';
import { CheckService } from 'app/percona/check/Check.service';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { ServiceFailedCheck } from '../../types';
import { PAGE_MODEL } from '../../CheckPanel.constants';
import { SERVICE_CHECKS_CANCEL_TOKEN, SERVICE_CHECKS_TABLE_ID } from './ServiceChecks.constants';
import { Messages } from './ServiceChecks.messages';
import { getStyles } from './ServiceChecks.styles';
import { Severity } from 'app/percona/integrated-alerting/components/Severity';
import { formatServiceId } from '../FailedChecksTab/FailedChecksTab.utils';
import { SilenceBell } from 'app/percona/shared/components/Elements/SilenceBell';

export const ServiceChecks: FC<GrafanaRouteComponentProps<{ service: string }>> = ({ match }) => {
  const serviceId = formatServiceId(match.params.service);
  const [pageSize, setPageSize] = useStoredTablePageSize(SERVICE_CHECKS_TABLE_ID);
  const [pageIndex, setPageindex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState<ServiceFailedCheck[]>([]);
  const [pending, setPending] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [generateToken] = useCancelToken();
  const styles = useStyles2(getStyles);

  const fetchChecks = useCallback(async () => {
    try {
      setPending(true);
      const {
        data,
        totals: { totalItems, totalPages },
      } = await CheckService.getFailedCheckForService(
        serviceId,
        pageSize,
        pageIndex,
        generateToken(SERVICE_CHECKS_CANCEL_TOKEN)
      );
      setData(data);
      setServiceName(data[0].serviceName);
      setTotalItems(totalItems);
      setTotalPages(totalPages);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setPending(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, serviceId]);

  const onSilenceClick = useCallback(
    async (alertId: string, silenced: boolean) => {
      await CheckService.silenceAlert(alertId, !silenced);
      fetchChecks();
    },
    [fetchChecks]
  );

  const columns = useMemo(
    (): Array<Column<ServiceFailedCheck>> => [
      {
        Header: 'Check Name',
        accessor: 'checkName',
      },
      {
        Header: 'Summary',
        accessor: 'summary',
      },
      {
        Header: 'Labels',
        accessor: 'labels',
        // eslint-disable-next-line react/display-name
        Cell: ({ value }) => {
          const labels = Object.keys(value);
          return (
            <div className={styles.chips}>
              {labels.map((label) => (
                <Chip key={label} text={`${label}:${value[label]}`} />
              ))}
            </div>
          );
        },
      },
      {
        Header: 'Severity',
        accessor: 'severity',
        // eslint-disable-next-line react/display-name
        Cell: ({ value }) => <Severity severity={value} />,
      },
      {
        Header: 'Details',
        accessor: 'readMoreUrl',
        // eslint-disable-next-line react/display-name
        Cell: ({ value }) =>
          value ? (
            <a target="_blank" rel="noreferrer" href={value} className={styles.link}>
              {Messages.readMore}
            </a>
          ) : null,
      },
      {
        Header: 'Actions',
        accessor: 'silenced',
        width: '30px',
        // eslint-disable-next-line react/display-name
        Cell: ({ value, row }) => (
          <span className={styles.actions}>
            <SilenceBell
              tooltip={value ? Messages.activate : Messages.silence}
              silenced={value}
              onClick={() => onSilenceClick(row.original.alertId, row.original.silenced)}
            />
          </span>
        ),
      },
    ],
    [styles.chips, styles.link, styles.actions, onSilenceClick]
  );

  const onPaginationChanged = useCallback(
    (pageSize: number, pageIndex: number) => {
      setPageSize(pageSize);
      setPageindex(pageIndex);
    },
    [setPageindex, setPageSize]
  );

  useEffect(() => {
    fetchChecks();
  }, [fetchChecks]);

  return (
    <PageWrapper pageModel={PAGE_MODEL} dataTestId="db-service-checks">
      <h3>{Messages.pageTitle(serviceName)}</h3>
      <Table
        showPagination
        data={data}
        columns={columns}
        totalItems={totalItems}
        totalPages={totalPages}
        pageSize={pageSize}
        pageIndex={pageIndex}
        onPaginationChanged={onPaginationChanged}
        pendingRequest={pending}
        emptyMessage={Messages.noChecks}
      />
    </PageWrapper>
  );
};

export default ServiceChecks;
