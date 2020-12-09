import React, { FC, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { HorizontalGroup, Select, useStyles } from '@grafana/ui';
import {
  Modal,
  LoaderButton,
  TextInputField,
  NumberInputField,
  TextareaInputField,
  logger,
} from '@percona/platform-core';
import { Messages } from 'app/features/integrated-alerting/IntegratedAlerting.messages';
import { AddAlertRuleModalProps, NotificationChannel } from './AddAlertRuleModal.types';
import { AlertRuleSeverity } from '../AlertRules.types';
import { getStyles } from './AddAlertRuleModal.styles';
// import { AlertRulesService } from '../AlertRules.service';

export const AddAlertRuleModal: FC<AddAlertRuleModalProps> = ({ isVisible, setVisible }) => {
  const styles = useStyles(getStyles);
  const [selectedSeverity, setSelectedSeverity] = useState();
  const [selectedChannel, setSelectedChannel] = useState();

  const onSubmit = async values => {
    try {
      // await AlertRulesService.create();
      setVisible(false);
    } catch (e) {
      logger.error(e);
    }
  };

  const severityOptions = useMemo(
    () =>
      Object.keys(AlertRuleSeverity).map(key => ({
        value: key,
        label: AlertRuleSeverity[key],
      })),
    []
  );

  const channelOptions = useMemo(
    () =>
      Object.keys(NotificationChannel).map(key => ({
        value: key,
        label: NotificationChannel[key],
      })),
    []
  );

  return (
    <Modal title={Messages.alertRules.addModal.title} isVisible={isVisible} onClose={() => setVisible(false)}>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, valid, pristine, submitting }) => (
          <form className={styles.form} onSubmit={handleSubmit}>
            <dl className={styles.formFieldsWrapper}>
              <dt>{Messages.alertRules.addModal.templateField}</dt>
              <dd>
                <TextInputField name="template" />
              </dd>

              <dt>{Messages.alertRules.addModal.nameField}</dt>
              <dd>
                <TextInputField name="name" />
              </dd>

              <dt>{Messages.alertRules.addModal.thresholdField}</dt>
              <dd>
                <TextInputField name="threshold" />
              </dd>

              <dt>{Messages.alertRules.addModal.durationField}</dt>
              <dd>
                <NumberInputField name="duration" />
              </dd>

              <dt>{Messages.alertRules.addModal.filtersField}</dt>
              <dd>
                <Select
                  className={styles.select}
                  name="severity"
                  value={selectedSeverity}
                  options={severityOptions}
                  onChange={severity => {
                    setSelectedSeverity(severity);
                  }}
                />
              </dd>

              <dt>{Messages.alertRules.addModal.filtersField}</dt>
              <dd>
                <TextareaInputField name="filters" />
              </dd>

              <dt>{Messages.alertRules.addModal.channelField}</dt>
              <dd>
                <Select
                  className={styles.select}
                  name="channel"
                  value={selectedChannel}
                  options={channelOptions}
                  onChange={channel => {
                    setSelectedChannel(channel);
                  }}
                />
              </dd>
            </dl>
            <HorizontalGroup justify="center" spacing="md">
              <LoaderButton
                data-qa="alert-rule-template-add-button"
                size="md"
                variant="primary"
                disabled={!valid || pristine}
                loading={submitting}
              >
                {Messages.alertRules.addModal.confirm}
              </LoaderButton>
            </HorizontalGroup>
          </form>
        )}
      />
    </Modal>
  );
};
