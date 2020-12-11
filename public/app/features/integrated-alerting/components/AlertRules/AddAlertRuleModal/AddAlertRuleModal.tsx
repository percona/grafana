import React, { FC, useEffect, useState } from 'react';
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
import { SelectableValue } from '@grafana/data';
import { AppEvents } from '@grafana/data';
import { Messages } from './AddAlertRuleModal.messages';
import { AddAlertRuleModalProps, AddAlertRuleFormValues } from './AddAlertRuleModal.types';
import { getStyles } from './AddAlertRuleModal.styles';
import { SEVERITY_OPTIONS, NOTIFICATION_CHANNEL_OPTIONS } from './AddAlertRulesModal.constants';
import { formatTemplateOptions, formatCreateAPIPayload } from './AddAlertRuleModal.utils';
import { AlertRulesService } from '../AlertRules.service';
import { AlertRuleTemplateService } from '../../AlertRuleTemplate/AlertRuleTemplate.service';
import { appEvents } from 'app/core/core';

const { required } = validators;

export const AddAlertRuleModal: FC<AddAlertRuleModalProps> = ({ isVisible, setVisible }) => {
  const styles = useStyles(getStyles);
  const [templateOptions, setTemplateOptions] = useState<Array<SelectableValue<string>>>();

  const getTemplates = async () => {
    try {
      const response = await AlertRuleTemplateService.list();
      setTemplateOptions(formatTemplateOptions(response.templates));
    } catch (e) {
      logger.error(e);
    }
  };

  useEffect(() => {
    getTemplates;
  }, []);

  const onSubmit = async (values: AddAlertRuleFormValues) => {
    try {
      await AlertRulesService.create(formatCreateAPIPayload(values));
      setVisible(false);
      appEvents.emit(AppEvents.alertSuccess, [Messages.addSuccess]);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Modal
      title={Messages.title}
      isVisible={isVisible}
      onClose={() => setVisible(false)}
      data-qa="add-alert-rule-modal"
    >
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, valid, pristine, submitting }) => (
          <form className={styles.form} onSubmit={handleSubmit} data-qa="add-alert-rule-modal-form">
            {/* TODO: polish this up */}
            <dl className={styles.formFieldsWrapper}>
              <dt>{Messages.templateField}</dt>
              <dd>
                <Field name="template" validate={required}>
                  {({ input }) => <Select className={styles.select} options={templateOptions} {...input} />}
                </Field>
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

              <dt>{Messages.severityField}</dt>
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
                data-qa="add-alert-rule-modal-form-add-button"
                size="md"
                variant="primary"
                disabled={!valid || pristine}
                loading={submitting}
              >
                {Messages.confirm}
              </LoaderButton>
              <Button
                data-qa="add-alert-rule-modal-form-cancel-button"
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
