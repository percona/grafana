import React, { FC, useContext, useEffect, useRef, useState } from 'react';
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
import { SEVERITY_OPTIONS, MINIMUM_DURATION_VALUE } from './AddAlertRulesModal.constants';
import {
  formatTemplateOptions,
  formatChannelsOptions,
  formatCreateAPIPayload,
  formatUpdateAPIPayload,
  getInitialValues,
  minValidator,
} from './AddAlertRuleModal.utils';
import { AlertRulesProvider } from '../AlertRules.provider';
import { AlertRulesService } from '../AlertRules.service';
import { AlertRuleTemplateService } from '../../AlertRuleTemplate/AlertRuleTemplate.service';
import { Template } from '../../AlertRuleTemplate/AlertRuleTemplate.types';
import { NotificationChannelService } from '../../NotificationChannel/NotificationChannel.service';
import { appEvents } from 'app/core/core';
import { AlertRuleParamField } from '../AlertRuleParamField';

const { required } = validators;
const durationValidators = [required, minValidator(MINIMUM_DURATION_VALUE)];
const nameValidators = [required];

export const AddAlertRuleModal: FC<AddAlertRuleModalProps> = ({ isVisible, setVisible, alertRule }) => {
  const styles = useStyles(getStyles);
  const [templateOptions, setTemplateOptions] = useState<Array<SelectableValue<string>>>();
  const [channelsOptions, setChannelsOptions] = useState<Array<SelectableValue<string>>>();
  const templates = useRef<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template>();
  const { getAlertRules } = useContext(AlertRulesProvider);

  const updateAlertRuleTemplateParams = () => {
    setCurrentTemplate(templates.current.find(template => template.name === alertRule?.rawValues.template.name));
  };

  const getData = async () => {
    try {
      const [channelsListResponse, templatesListResponse] = await Promise.all([
        NotificationChannelService.list({
          page_params: {
            index: 0,
            page_size: 100,
          },
        }),
        AlertRuleTemplateService.list({
          page_params: {
            index: 0,
            page_size: 100,
          },
        }),
      ]);
      setChannelsOptions(formatChannelsOptions(channelsListResponse.channels));
      setTemplateOptions(formatTemplateOptions(templatesListResponse.templates));
      templates.current = templatesListResponse.templates;
      updateAlertRuleTemplateParams();
    } catch (e) {
      logger.error(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    updateAlertRuleTemplateParams();
  }, [alertRule]);

  const initialValues = getInitialValues(alertRule);
  const onSubmit = async (values: AddAlertRuleFormValues) => {
    try {
      if (alertRule) {
        await AlertRulesService.update(
          formatUpdateAPIPayload(alertRule.rawValues.rule_id, values, currentTemplate?.params)
        );
      } else {
        await AlertRulesService.create(formatCreateAPIPayload(values, currentTemplate?.params));
      }
      setVisible(false);
      appEvents.emit(AppEvents.alertSuccess, [alertRule ? Messages.updateSuccess : Messages.createSuccess]);
      getAlertRules();
    } catch (e) {
      logger.error(e);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setCurrentTemplate(undefined);
  };

  const handleTemplateChange = (name = '') => {
    const template = templates.current.find(template => template.name === name);
    setCurrentTemplate(template);
  };

  return (
    <Modal
      title={alertRule ? Messages.editRuleTitle : Messages.addRuleTitle}
      isVisible={isVisible}
      onClose={handleClose}
      data-qa="add-alert-rule-modal"
    >
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        mutators={{
          changeSeverity: ([templateName], state, tools) => {
            const severityStr = templates.current.find(template => template.name === templateName)?.severity;
            const newSeverity = SEVERITY_OPTIONS.find(severity => severity.value === severityStr);

            if (newSeverity) {
              // TODO since editing the template name is not allowed so far, no need to keep previous option.
              // When edition is allowed, the function param below can take the old value as argument, thus we can keep the selection
              // before changing it, e.g. "(oldSeverity) => oldSeverity | newSeverity"
              tools.changeValue(state, 'severity', () => newSeverity);
            }
          },
          changeDuration: ([templateName], state, tools) => {
            const newDuration = templates.current.find(template => template.name === templateName)?.for;
            tools.changeValue(state, 'duration', () => (newDuration ? parseInt(newDuration, 10) : undefined));
          },
        }}
        render={({ handleSubmit, valid, pristine, submitting, form }) => (
          <form className={styles.form} onSubmit={handleSubmit} data-qa="add-alert-rule-modal-form">
            <Field name="template" validate={required}>
              {({ input }) => (
                <>
                  <label className={styles.label} data-qa="template-select-label">
                    {Messages.templateField}
                  </label>
                  <Select
                    disabled={!!alertRule}
                    className={styles.select}
                    options={templateOptions}
                    {...input}
                    onChange={name => {
                      input.onChange(name);
                      form.mutators.changeSeverity(name.value);
                      form.mutators.changeDuration(name.value);
                      handleTemplateChange(name.value);
                    }}
                    data-qa="template-select-input"
                  />
                </>
              )}
            </Field>

            <TextInputField label={Messages.nameField} name="name" validators={nameValidators} />

            {currentTemplate &&
              currentTemplate.params?.map(param => <AlertRuleParamField key={param.name} param={param} />)}

            <NumberInputField label={Messages.durationField} name="duration" validators={durationValidators} />

            <Field name="severity" validate={required}>
              {({ input }) => (
                <>
                  <label className={styles.label} data-qa="severity-select-label">
                    {Messages.severityField}
                  </label>
                  <Select
                    className={styles.select}
                    options={SEVERITY_OPTIONS}
                    {...input}
                    data-qa="severity-multiselect-input"
                  />
                </>
              )}
            </Field>

            <TextareaInputField label={Messages.filtersField} name="filters" />

            <Field name="notificationChannels">
              {({ input }) => (
                <>
                  <label className={styles.label} data-qa="notification-channel-select-label">
                    {Messages.channelField}
                  </label>
                  <MultiSelect
                    className={styles.select}
                    options={channelsOptions}
                    {...input}
                    data-qa="notificationChannels-multiselect-input"
                  />
                </>
              )}
            </Field>

            {currentTemplate && (
              <>
                <div data-qa="template-expression" className={styles.templateParsedField}>
                  <label className={styles.label}>{Messages.templateExpression}</label>
                  <pre>{currentTemplate.expr}</pre>
                </div>
                {currentTemplate.annotations?.summary && (
                  <div data-qa="template-alert" className={styles.templateParsedField}>
                    <label className={styles.label}>{Messages.ruleAlert}</label>
                    <pre>{currentTemplate.annotations?.summary}</pre>
                  </div>
                )}
              </>
            )}

            <Field name="enabled" type="checkbox" defaultValue={true}>
              {({ input }) => (
                <>
                  <label className={styles.label} data-qa="enabled-toggle-label">
                    {Messages.activateSwitch}
                  </label>
                  <Switch {...input} value={input.checked} data-qa="enabled-toggle-input" />
                </>
              )}
            </Field>

            <div className={styles.actionsWrapper}>
              <HorizontalGroup justify="center" spacing="md">
                <LoaderButton
                  data-qa="add-alert-rule-modal-add-button"
                  // TODO: fix LoaderButton types
                  // @ts-ignore
                  size="md"
                  variant="primary"
                  disabled={!valid || pristine}
                  loading={submitting}
                >
                  {alertRule ? Messages.update : Messages.create}
                </LoaderButton>
                <Button
                  data-qa="add-alert-rule-modal-cancel-button"
                  variant="secondary"
                  onClick={() => setVisible(false)}
                >
                  {Messages.cancel}
                </Button>
              </HorizontalGroup>
            </div>
          </form>
        )}
      />
    </Modal>
  );
};
