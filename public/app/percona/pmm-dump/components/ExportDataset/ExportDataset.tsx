/* eslint-disable @typescript-eslint/consistent-type-assertions */
// import { cx } from '@emotion/css';
import React, { FC, useState, useEffect, useCallback } from 'react';
import { Field, withTypes } from 'react-final-form';
import { useHistory } from 'react-router-dom';

import { SelectableValue, DateTime, dateTime, TimeRange } from '@grafana/data';
import { LinkButton, PageToolbar, DateTimePicker, useStyles2 } from '@grafana/ui';
import { GrafanaRouteComponentProps } from 'app/core/navigation/types';
import { LoaderButton } from 'app/percona/shared/components/Elements/LoaderButton';
import { Overlay } from 'app/percona/shared/components/Elements/Overlay';
import { SelectField } from 'app/percona/shared/components/Form/SelectField';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { fetchNodesAction } from 'app/percona/shared/core/reducers/nodes/nodes';
import { getNodes } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import { SwitchRow } from '../../../settings/components/Advanced/SwitchRow';
import { PMMDumpService } from '../../PMMDump.service';

import { GET_NODES_CANCEL_TOKEN, DUMP_URL } from './ExportDataset.constants';
import { Messages } from './ExportDataset.messages';
import { getStyles } from './ExportDataset.styles';
import { ExportDatasetProps } from './ExportDataset.types';

const { Form } = withTypes<ExportDatasetProps>();

const ExportDataset: FC<GrafanaRouteComponentProps<{ type: string; id: string }>> = ({ match }) => {
  const styles = useStyles2(getStyles);
  const dispatch = useAppDispatch();

  const [selectedTimerange, setSelectedTimerange] = useState<TimeRange>();

  const { nodes = [], isLoading } = useSelector(getNodes);

  const nodeOptions = isLoading
    ? []
    : nodes?.map(
        ({ nodeId, nodeName }): SelectableValue<string> => ({
          label: nodeName,
          value: nodeId,
        })
      );
  // const [backupErrors, setBackupErrors] = useState<ApiVerboseError[]>([]);
  const [generateToken] = useCancelToken();
  const [endDate, setEndDate] = useState<DateTime>(dateTime(new Date().setSeconds(0, 0)));
  let defaultEndDate = new Date();
  defaultEndDate.setSeconds(0, 0);
  const [date, setDate] = useState<DateTime>(dateTime(new Date(defaultEndDate.getTime() - 6 * 1000 * 60 * 60)));

  const loadData = useCallback(async () => {
    try {
      await dispatch(fetchNodesAction({ token: generateToken(GET_NODES_CANCEL_TOKEN) })).unwrap();
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
    setSelectedTimerange({
      from: dateTime(new Date('2023-10-03T04:35:46.795Z')),
      to: dateTime(new Date('2023-10-03T10:35:46.795Z')),
      raw: {
        from: 'now-6h',
        to: 'now',
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const history = useHistory();
  const handleGoBack = () => {
    history.push(DUMP_URL);
  };

  const handleSubmit = async (data: ExportDatasetProps) => {
    let nodeids;
    if (data?.service) {
      nodeids = [data.service.value];
    } else {
      nodeids = nodes?.map(({ nodeId }): string => nodeId);
    }

    await PMMDumpService.triggerDump(
      nodeids,
      date.toISOString(),
      endDate.toISOString(),
      data.QAN ? true : false,
      data.load ? true : false
    );

    history.push(DUMP_URL);
  };

  return (
    <Overlay>
      <Form
        onSubmit={handleSubmit}
        render={({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit} className={styles.form}>
            <PageToolbar title="PMM Export / Export new dataset" onGoBack={handleGoBack}>
              <LinkButton href={DUMP_URL} data-testid="cancel-button" variant="secondary" fill="outline">
                Cancel
              </LinkButton>
            </PageToolbar>
            <div className={styles.contentOuter}>
              <div className={styles.contentInner}>
                <div className={styles.pageWrapper}>
                  <h1 className={styles.headingStyle}>{Messages.introduction}</h1>
                  <div>{Messages.summary}</div>
                  <h3 className={styles.heading3Style}>{Messages.title}</h3>
                  <span className={styles.SelectFieldWrap}>
                    <Field name="service">
                      {({ input }) => (
                        <SelectField
                          label={Messages.selectNodes}
                          options={nodeOptions}
                          placeholder={Messages.allNodes}
                          {...input}
                          isLoading={isLoading}
                          className={styles.selectField}
                          data-testid="service-select-input"
                        />
                      )}
                    </Field>
                  </span>

                  <div className={styles.datePicker}>
                    <div>
                      {Messages.selectStart}
                      {selectedTimerange && (
                        <div className={styles.SelectFieldWrap}>
                          {/* <Label label="Timestamp" /> */}
                          <DateTimePicker
                            label="Date"
                            date={date}
                            onChange={setDate}
                            timepickerProps={{
                              showSecond: false,
                              hideDisabledOptions: true,
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      {Messages.selectEnd}
                      {selectedTimerange && (
                        <div className={styles.SelectFieldWrap}>
                          {/* <Label label="Timestamp" /> */}
                          <DateTimePicker
                            label="Date"
                            date={endDate}
                            onChange={setEndDate}
                            timepickerProps={{
                              showSecond: false,
                              hideDisabledOptions: true,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.switch}>
                    <Field
                      name="QAN"
                      type="checkbox"
                      label="Export QAN"
                      dataTestId="advanced-backup"
                      component={SwitchRow}
                    />

                    <Field
                      name="load"
                      type="checkbox"
                      label="Ignore Load"
                      dataTestId="advanced-backup"
                      tooltip="Test"
                      component={SwitchRow}
                    />
                  </div>
                  <div className={styles.submitButton}>
                    <LoaderButton
                      data-testid="backup-add-button"
                      size="md"
                      type="submit"
                      variant="primary"
                      disabled={false}
                      loading={false}
                    >
                      {Messages.createDataset}
                    </LoaderButton>
                  </div>

                  {isLoading ? undefined : console.log(nodes.length && !isLoading ? nodes.map((m) => m) : [])}
                </div>
              </div>
            </div>
          </form>
        )}
      ></Form>
    </Overlay>
  );
};

export default ExportDataset;
