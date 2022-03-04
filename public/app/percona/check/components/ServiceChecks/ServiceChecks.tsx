import React, { FC, useEffect, useCallback, useState, useMemo } from 'react';
import { logger } from '@percona/platform-core';
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

export const ServiceChecks: FC<GrafanaRouteComponentProps<{ service: string }>> = ({ match }) => {
  const serviceId = match.params.service;
  const [pageSize, setPageSize] = useStoredTablePageSize(SERVICE_CHECKS_TABLE_ID);
  const [pageIndex, setPageindex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState<ServiceFailedCheck[]>([]);
  const [pending, setPending] = useState(false);
  const [generateToken] = useCancelToken();

  const columns = useMemo(
    (): Array<Column<ServiceFailedCheck>> => [
      {
        Header: 'Service Name',
        accessor: 'serviceName',
      },
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
      },
      {
        Header: 'Severity',
        accessor: 'severity',
      },
      {
        Header: 'Read More',
        accessor: 'readMoreUrl',
      },
    ],
    []
  );

  const onPaginationChanged = useCallback(
    (pageSize: number, pageIndex: number) => {
      setPageSize(pageSize);
      setPageindex(pageIndex);
    },
    [setPageindex, setPageSize]
  );

  useEffect(() => {
    const fetchChecks = async () => {
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
        setTotalItems(totalItems);
        setTotalPages(totalPages);
      } catch (e) {
        if (isApiCancelError(e)) {
          return;
        }
        logger.error(e);
      }
      setPending(false);
    };
    fetchChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  return (
    <PageWrapper pageModel={PAGE_MODEL} dataTestId="db-service-checks">
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
