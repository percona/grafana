import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { Column } from 'react-table';
import { logger } from '@percona/platform-core';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { CheckDetails, Interval } from 'app/percona/check/types';
import { CheckService } from 'app/percona/check/Check.service';
import { Messages } from './AllChecksTab.messages';
import { GET_ALL_CHECKS_CANCEL_TOKEN } from './AllChecksTab.constants';
import { FetchChecks } from './types';
import { CheckActions } from './CheckActions/CheckActions';
import { ChangeCheckIntervalModal } from './ChangeCheckIntervalModal';

export const AllChecksTab: FC = () => {
  const [fetchChecksPending, setFetchChecksPending] = useState(false);
  const [checkIntervalModalVisible, setCheckIntervalModalVisible] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<CheckDetails>();
  const [checks, setChecks] = useState<CheckDetails[]>([]);
  const [generateToken] = useCancelToken();

  const fetchChecks: FetchChecks = useCallback(async () => {
    setFetchChecksPending(true);

    try {
      const checks = await CheckService.getAllChecks(generateToken(GET_ALL_CHECKS_CANCEL_TOKEN));

      setChecks(checks);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setFetchChecksPending(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUI = (check: CheckDetails) => {
    const { name, disabled, interval } = check;

    setChecks((oldChecks) =>
      oldChecks?.map((oldCheck) => {
        if (oldCheck.name !== name) {
          return oldCheck;
        }

        return { ...oldCheck, disabled, interval };
      })
    );
  };

  const changeCheck = useCallback(async (check: CheckDetails) => {
    const action = !!check.disabled ? 'enable' : 'disable';
    try {
      await CheckService.changeCheck({ params: [{ name: check.name, [action]: true }] });
      updateUI({ ...check, disabled: !check.disabled });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleIntervalChangeClick = useCallback((check: CheckDetails) => {
    setSelectedCheck(check);
    setCheckIntervalModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setCheckIntervalModalVisible(false);
    setSelectedCheck(undefined);
  }, []);

  const handleIntervalChanged = useCallback(
    (check: CheckDetails) => {
      updateUI({ ...check });
      handleModalClose();
    },
    [handleModalClose]
  );

  const columns = useMemo(
    (): Array<Column<CheckDetails>> => [
      {
        Header: Messages.table.columns.name,
        accessor: 'name',
      },
      {
        Header: Messages.table.columns.description,
        accessor: 'description',
      },
      {
        Header: Messages.table.columns.status,
        accessor: 'disabled',
        Cell: ({ value }) => (!!value ? Messages.disabled : Messages.enabled),
      },
      {
        Header: Messages.table.columns.interval,
        accessor: 'interval',
        Cell: ({ value }) => Interval[value],
      },
      {
        Header: Messages.table.columns.actions,
        accessor: 'name',
        id: 'actions',
        // eslint-disable-next-line react/display-name
        Cell: ({ row }) => (
          <CheckActions
            check={row.original}
            onChangeCheck={changeCheck}
            onIntervalChangeClick={handleIntervalChangeClick}
          />
        ),
      },
    ],
    [changeCheck, handleIntervalChangeClick]
  );

  useEffect(() => {
    fetchChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Table
        totalItems={checks.length}
        data={checks}
        columns={columns}
        pendingRequest={fetchChecksPending}
        emptyMessage={Messages.table.noData}
      />
      {!!selectedCheck && checkIntervalModalVisible && (
        <ChangeCheckIntervalModal
          setVisible={setCheckIntervalModalVisible}
          check={selectedCheck}
          onClose={handleModalClose}
          onIntervalChanged={handleIntervalChanged}
        />
      )}
    </>
  );
};
