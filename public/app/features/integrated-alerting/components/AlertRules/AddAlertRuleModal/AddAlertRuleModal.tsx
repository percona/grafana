import React, { FC } from 'react';
import { Form, Field } from 'react-final-form';
import { Button, HorizontalGroup, Switch, Select, MultiSelect, useStyles } from '@grafana/ui';
import {
  Modal,
  LoaderButton,
  TextInputField,
  NumberInputField,
  TextareaInputField,
  logger,
  validators,
} from '@percona/platform-core';
import { Messages } from './AddAlertRuleModal.messages';
import { AddAlertRuleModalProps, AddAlertRuleFormValues } from './AddAlertRuleModal.types';
import { getStyles } from './AddAlertRuleModal.styles';
import { SEVERITY_OPTIONS, NOTIFICATION_CHANNEL_OPTIONS } from './AddAlertRulesModal.constants';
import { formatCreateAPIPayload } from './AddAlertRuleModal.utils';
import { AlertRulesService } from '../AlertRules.service';

const { required } = validators;

export const AddAlertRuleModal: FC<AddAlertRuleModalProps> = ({ isVisible, setVisible }) => {
  const styles = useStyles(getStyles);

  const onSubmit = async (values: AddAlertRuleFormValues) => {
    try {
      await AlertRulesService.create(formatCreateAPIPayload(values));
      setVisible(false);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Modal title={Messages.title} isVisible={isVisible} onClose={() => setVisible(false)}>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, valid, pristine, submitting }) => (
          <form className={styles.form} onSubmit={handleSubmit}>
            <dl className={styles.formFieldsWrapper}>
              <dt>{Messages.templateField}</dt>
              <dd>
                <TextInputField name="template" validators={[required]} />
              </dd>

              <dt>{Messages.nameField}</dt>
              <dd>
                <TextInputField name="name" validators={[required]} />
              </dd>

              <dt>{Messages.thresholdField}</dt>
              <dd>
                <TextInputField name="threshold" validators={[required]} />
              </dd>

              <dt>{Messages.durationField}</dt>
              <dd>
                <NumberInputField name="duration" validators={[required]} />
              </dd>

              <dt>{Messages.filtersField}</dt>
              <dd>
                <Field name="severity" validate={required}>
                  {({ input }) => <Select className={styles.select} options={SEVERITY_OPTIONS} {...input} />}
                </Field>
              </dd>

              <dt>{Messages.filtersField}</dt>
              <dd>
                <TextareaInputField name="filters" validators={[required]} />
              </dd>

              <dt>{Messages.channelField}</dt>
              <dd>
                <Field name="notificationChannels" validate={required}>
                  {({ input }) => (
                    <MultiSelect className={styles.select} options={NOTIFICATION_CHANNEL_OPTIONS} {...input} />
                  )}
                </Field>
              </dd>

              <dt>{Messages.activateSwitch}</dt>
              <dd>
                <Field name="enabled">{({ input }) => <Switch {...input} />}</Field>
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
                {Messages.confirm}
              </LoaderButton>
              <Button
                data-qa="notification-channel-cancel-button"
                variant="secondary"
                onClick={() => setVisible(false)}
              >
                {Messages.cancel}
              </Button>
            </HorizontalGroup>
          </form>
        )}
      />
    </Modal>
  );
};
