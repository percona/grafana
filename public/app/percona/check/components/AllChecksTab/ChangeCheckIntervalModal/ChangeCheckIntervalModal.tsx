import React, { FC, useState } from 'react';
import { logger, RadioButtonGroupField } from '@percona/platform-core';
import { Messages } from './ChangeCheckIntervalModal.messages';
import { Form } from 'react-final-form';
import { Button, HorizontalGroup, useStyles } from '@grafana/ui';
import { LoaderButton, Modal } from '@percona/platform-core';
import { appEvents } from 'app/core/app_events';
import { CheckService } from 'app/percona/check/Check.service';
import { getStyles } from './ChangeCheckIntervalModal.styles';
import { ChangeCheckIntervalModalProps } from './types';
import { checkIntervalOptions } from './ChangeCheckIntervalModal.constants';
import { AppEvents } from '@grafana/data';

export const ChangeCheckIntervalModal: FC<ChangeCheckIntervalModalProps> = ({
  interval,
  checkName,
  isVisible,
  setVisible,
}) => {
  const styles = useStyles(getStyles);
  const [pending, setPending] = useState(false);
  const [selectedInterval] = useState(interval);

  const changeInterval = async () => {
    try {
      setPending(true);
      await CheckService.changeInterval({
        name: checkName,
        interval: selectedInterval,
      });
      setVisible(false);
      appEvents.emit(AppEvents.alertSuccess, [Messages.getSuccess(checkName)]);
    } catch (e) {
      logger.error(e);
    } finally {
      setPending(false);
    }
  };

  const initialValues = {
    interval,
  };

  return (
    <Modal title={Messages.title} isVisible={isVisible} onClose={() => setVisible(false)}>
      <div className={styles.content}>
        <h4 className={styles.title}>{Messages.getDescription(checkName)}</h4>
        <Form
          onSubmit={() => {}}
          initialValues={initialValues}
          render={({ form, handleSubmit, valid, pristine }) => (
            <form className={styles.form} onSubmit={handleSubmit}>
              <RadioButtonGroupField name="interval" options={checkIntervalOptions} />
            </form>
          )}
        />
      </div>
      <HorizontalGroup justify="center" spacing="md">
        <LoaderButton
          loading={pending}
          variant="destructive"
          size="md"
          onClick={changeInterval}
          data-qa="change-check-interval-modal-save"
        >
          {Messages.save}
        </LoaderButton>
        <Button
          variant="secondary"
          size="md"
          onClick={() => setVisible(false)}
          data-qa="change-check-interval-modal-cancel"
        >
          {Messages.cancel}
        </Button>
      </HorizontalGroup>
    </Modal>
  );
};
