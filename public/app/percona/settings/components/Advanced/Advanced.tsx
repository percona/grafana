import React, { FC, useState } from 'react';
import { Field, withTypes } from 'react-final-form';
import { FormApi } from 'final-form';
import { cx } from 'emotion';
import { Button, Spinner, useTheme, Icon } from '@grafana/ui';
import { TextInputField, NumberInputField } from '@percona/platform-core';
import { getSettingsStyles } from 'app/percona/settings/Settings.styles';
import { Messages, DATA_RETENTION_URL } from 'app/percona/settings/Settings.messages';
import { LinkTooltip } from 'app/percona/shared/components/Elements/LinkTooltip/LinkTooltip';
import validators from 'app/percona/shared/helpers/validators';
import { getStyles } from './Advanced.styles';
import { convertSecondsToDays, convertCheckIntervalsToHours, convertHoursStringToSeconds } from './Advanced.utils';
import {
  SECONDS_IN_DAY,
  MIN_DAYS,
  MAX_DAYS,
  MIN_STT_CHECK_INTERVAL,
  STT_CHECK_INTERVAL_STEP,
  STT_CHECK_INTERVALS,
  TECHNICAL_PREVIEW_DOC_URL,
  REFRESH_FEATURE_KEYS,
  FEATURE_KEYS,
} from './Advanced.constants';
import { AdvancedProps, AdvancedFormProps } from './Advanced.types';
import { SwitchRow } from './SwitchRow';
import { AdvancedChangePayload } from '../../Settings.types';

const {
  advanced: { sttCheckIntervalsLabel, sttCheckIntervalTooltip, sttCheckIntervalUnit },
} = Messages;

export const Advanced: FC<AdvancedProps> = ({
  dataRetention,
  telemetryEnabled,
  backupEnabled,
  updatesDisabled,
  sttEnabled,
  dbaasEnabled,
  alertingEnabled,
  azureDiscoverEnabled,
  publicAddress,
  updateSettings,
  sttCheckIntervals,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);
  const { rareInterval, standardInterval, frequentInterval } = convertCheckIntervalsToHours(sttCheckIntervals);
  const {
    advanced: {
      action,
      retentionLabel,
      retentionTooltip,
      retentionUnits,
      telemetryLabel,
      telemetryLink,
      telemetryTooltip,
      updatesLabel,
      updatesLink,
      updatesTooltip,
      sttLabel,
      sttLink,
      sttTooltip,
      dbaasLabel,
      dbaasTooltip,
      dbaasLink,
      publicAddressLabel,
      publicAddressTooltip,
      publicAddressButton,
      alertingLabel,
      alertingTooltip,
      alertingLink,
      azureDiscoverLabel,
      azureDiscoverTooltip,
      azureDiscoverLink,
      technicalPreviewLegend,
      technicalPreviewDescription,
      technicalPreviewLinkText,
      backupLabel,
      backupLink,
      backupTooltip,
    },
    tooltipLinkText,
  } = Messages;

  const initialValues: AdvancedFormProps = {
    retention: convertSecondsToDays(dataRetention),
    telemetry: telemetryEnabled,
    updates: !updatesDisabled,
    backup: backupEnabled,
    stt: sttEnabled,
    dbaas: dbaasEnabled,
    azureDiscover: azureDiscoverEnabled,
    publicAddress,
    alerting: alertingEnabled,
    rareInterval,
    standardInterval,
    frequentInterval,
  };
  const [loading, setLoading] = useState(false);
  // @ts-ignore
  const applyChanges = (values: AdvancedFormProps, form: FormApi<AdvancedFormProps>) => {
    const {
      retention,
      telemetry,
      stt,
      publicAddress,
      dbaas,
      alerting,
      backup,
      azureDiscover,
      rareInterval,
      standardInterval,
      frequentInterval,
      updates,
    } = values;
    const sttCheckIntervals = {
      rare_interval: `${convertHoursStringToSeconds(rareInterval)}s`,
      standard_interval: `${convertHoursStringToSeconds(standardInterval)}s`,
      frequent_interval: `${convertHoursStringToSeconds(frequentInterval)}s`,
    };
    const refresh = !!REFRESH_FEATURE_KEYS.find((feature) => !!values[feature] !== initialValues[feature]);
    const body: AdvancedChangePayload = {
      data_retention: `${+retention * SECONDS_IN_DAY}s`,
      disable_telemetry: !telemetry,
      enable_telemetry: telemetry,
      disable_stt: !stt,
      enable_stt: stt,
      disable_azurediscover: !azureDiscover,
      enable_azurediscover: azureDiscover,
      pmm_public_address: publicAddress,
      remove_pmm_public_address: !publicAddress,
      enable_alerting: alerting ? true : undefined,
      disable_alerting: !alerting ? true : undefined,
      stt_check_intervals: !!stt ? sttCheckIntervals : undefined,
      enable_backup_management: backup,
      disable_backup_management: !backup,
      enable_dbaas: dbaas,
      disable_dbaas: !dbaas,
      enable_updates: updates,
      disable_updates: !updates,
    };
    const onError = () => FEATURE_KEYS.forEach((key) => form.change(key, initialValues[key]));

    updateSettings(body, setLoading, refresh, onError);
  };
  const { Form } = withTypes<AdvancedFormProps>();

  return (
    <div className={styles.advancedWrapper}>
      <Form
        onSubmit={applyChanges}
        initialValues={initialValues}
        render={({ form: { change }, values, handleSubmit, valid, pristine }) => (
          <form onSubmit={handleSubmit}>
            <div className={styles.advancedRow}>
              <div className={styles.advancedCol}>
                <div className={settingsStyles.labelWrapper} data-qa="advanced-label">
                  <span>{retentionLabel}</span>
                  <LinkTooltip
                    tooltipText={retentionTooltip}
                    link={DATA_RETENTION_URL}
                    linkText={tooltipLinkText}
                    icon="info-circle"
                  />
                </div>
              </div>
              <div className={styles.inputWrapper}>
                <NumberInputField
                  name="retention"
                  validators={[validators.required, validators.range(MIN_DAYS, MAX_DAYS)]}
                />
              </div>
              <span className={styles.unitsLabel}>{retentionUnits}</span>
            </div>
            <Field
              name="telemetry"
              type="checkbox"
              label={telemetryLabel}
              tooltip={telemetryTooltip}
              tooltipLinkText={tooltipLinkText}
              link={telemetryLink}
              className={cx({ [styles.switchDisabled]: values.stt || values.alerting })}
              disabled={values.stt || values.alerting}
              dataQa="advanced-telemetry"
              component={SwitchRow}
            />
            <Field
              name="updates"
              type="checkbox"
              label={updatesLabel}
              tooltip={updatesTooltip}
              tooltipLinkText={tooltipLinkText}
              link={updatesLink}
              dataQa="advanced-updates"
              component={SwitchRow}
            />
            <Field
              name="stt"
              type="checkbox"
              label={sttLabel}
              tooltip={sttTooltip}
              tooltipLinkText={tooltipLinkText}
              link={sttLink}
              className={cx({ [styles.switchDisabled]: !values.telemetry })}
              disabled={!values.telemetry}
              dataQa="advanced-stt"
              component={SwitchRow}
            />
            <div className={styles.advancedRow}>
              <div className={cx(styles.advancedCol, styles.advancedChildCol, styles.sttCheckIntervalsLabel)}>
                <div className={settingsStyles.labelWrapper} data-qa="check-intervals-label">
                  <span>{sttCheckIntervalsLabel}</span>
                  <LinkTooltip tooltipText={sttCheckIntervalTooltip} icon="info-circle" />
                </div>
              </div>
            </div>
            {STT_CHECK_INTERVALS.map(({ label, name }) => (
              <div key={name} className={styles.advancedRow}>
                <div className={cx(styles.advancedCol, styles.advancedChildCol)}>
                  <div className={settingsStyles.labelWrapper} data-qa={`check-interval-${name}-label`}>
                    <span>{label}</span>
                  </div>
                </div>
                <div className={styles.inputWrapper}>
                  <NumberInputField
                    inputProps={{ step: STT_CHECK_INTERVAL_STEP, min: MIN_STT_CHECK_INTERVAL }}
                    disabled={!values.stt}
                    name={name}
                    validators={[validators.required, validators.min(MIN_STT_CHECK_INTERVAL)]}
                  />
                </div>
                <span className={styles.unitsLabel}>{sttCheckIntervalUnit}</span>
              </div>
            ))}
            <div className={styles.advancedRow}>
              <div className={cx(styles.advancedCol, styles.publicAddressLabelWrapper)}>
                <div className={settingsStyles.labelWrapper} data-qa="public-address-label">
                  <span>{publicAddressLabel}</span>
                  <LinkTooltip tooltipText={publicAddressTooltip} icon="info-circle" />
                </div>
              </div>
              <div className={styles.publicAddressWrapper}>
                <TextInputField name="publicAddress" className={styles.publicAddressInput} />
                <Button
                  className={styles.publicAddressButton}
                  type="button"
                  variant="secondary"
                  data-qa="public-address-button"
                  onClick={() => change('publicAddress', window.location.hostname)}
                >
                  <Icon name="link" />
                  {publicAddressButton}
                </Button>
              </div>
            </div>
            <fieldset className={styles.technicalPreview}>
              <legend>{technicalPreviewLegend}</legend>
              <div className={styles.technicalPreviewDoc}>
                <Icon name="info-circle" size={'xl'} className={styles.technicalPreviewIcon} />
                <p>
                  {technicalPreviewDescription}{' '}
                  <a href={TECHNICAL_PREVIEW_DOC_URL} target="_blank" rel="noreferrer">
                    {technicalPreviewLinkText}
                  </a>
                </p>
              </div>
              <Field
                name="dbaas"
                type="checkbox"
                label={dbaasLabel}
                tooltip={dbaasTooltip}
                tooltipLinkText={tooltipLinkText}
                link={dbaasLink}
                dataQa="advanced-dbaas"
                component={SwitchRow}
              />
              <Field
                name="backup"
                type="checkbox"
                label={backupLabel}
                tooltip={backupTooltip}
                tooltipLinkText={tooltipLinkText}
                link={backupLink}
                className={cx({ [styles.switchDisabled]: !values.backup })}
                dataQa="advanced-backup"
                component={SwitchRow}
              />
              <Field
                name="alerting"
                type="checkbox"
                label={alertingLabel}
                tooltip={alertingTooltip}
                tooltipLinkText={tooltipLinkText}
                link={alertingLink}
                className={cx({ [styles.switchDisabled]: !values.telemetry })}
                disabled={!values.telemetry}
                dataQa="advanced-alerting"
                component={SwitchRow}
              />
              <Field
                name="azureDiscover"
                type="checkbox"
                label={azureDiscoverLabel}
                tooltip={azureDiscoverTooltip}
                tooltipLinkText={tooltipLinkText}
                link={azureDiscoverLink}
                dataQa="advanced-azure-discover"
                component={SwitchRow}
              />
            </fieldset>
            <Button
              className={settingsStyles.actionButton}
              type="submit"
              disabled={!valid || pristine || loading}
              data-qa="advanced-button"
            >
              {loading && <Spinner />}
              {action}
            </Button>
          </form>
        )}
      />
    </div>
  );
};
