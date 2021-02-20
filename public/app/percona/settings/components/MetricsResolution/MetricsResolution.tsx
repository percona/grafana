import React, { FC, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { Button, Spinner, useTheme } from '@grafana/ui';
import { RadioButtonGroup } from 'app/percona/shared/components/Form/Radio/RadioButtonGroup';
import { getSettingsStyles } from 'app/percona/settings/Settings.styles';
import { Messages } from 'app/percona/settings/Settings.messages';
import { MetricsResolutions } from 'app/percona/settings/Settings.types';
import { LinkTooltip } from 'app/percona/shared/components/Elements/LinkTooltip/LinkTooltip';
import { NumericInputField } from 'app/percona/shared/components/Form';
import validators from 'app/percona/shared/helpers/validators';
import { resolutionsOptions, defaultResolutions, resolutionMin, resolutionMax } from './MetricsResolution.constants';
import { getStyles } from './MetricsResolution.styles';
import { getResolutionValue, removeUnits, addUnits } from './MetricsResolution.utils';
import {
  MetricsResolutionProps,
  MetricsResolutionPresets,
  MetricsResolutionIntervals,
} from './MetricsResolution.types';
import { NumberInputField } from '@percona/platform-core';
import { MAX_DAYS, MIN_DAYS } from '../Advanced/Advanced.constants';

export const MetricsResolution: FC<MetricsResolutionProps> = ({ metricsResolutions, updateSettings }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);
  const initialResolutions: MetricsResolutions = removeUnits(metricsResolutions);
  const [resolution, setResolution] = useState(getResolutionValue(metricsResolutions).key);
  const [customResolutions, updateCustomResolutions] = useState(initialResolutions);
  const [loading, setLoading] = useState(false);
  const {
    metrics: {
      action,
      label,
      link,
      tooltip,
      intervals: { low, medium, high },
    },
    tooltipLinkText,
  } = Messages;
  const changeResolutions = (state: any, changeValue: any, newResolutions: MetricsResolutions) => {
    Object.entries(newResolutions).forEach(([key, value]) =>
      changeValue(state, MetricsResolutionIntervals[key], () => value)
    );
  };
  const setNewResolutions = ([newResolution], state: any, { changeValue }) => {
    if (resolution === MetricsResolutionPresets.custom) {
      updateCustomResolutions(state.formState.values as MetricsResolutions);
    }

    if (newResolution !== MetricsResolutionPresets.custom) {
      const newResolutionKey = resolutionsOptions.findIndex(r => r.key === newResolution);
      const resolutions = removeUnits(defaultResolutions[newResolutionKey]);

      changeResolutions(state, changeValue, resolutions);
    } else {
      changeResolutions(state, changeValue, customResolutions);
    }

    setResolution(newResolution);
  };
  const resolutionValidators = [validators.required, validators.range(MIN_DAYS, MAX_DAYS)];
  const applyChanges = (values: MetricsResolutions) => {
    updateSettings({ metrics_resolutions: addUnits(values) }, setLoading);
  };

  return (
    <div className={styles.resolutionsWrapper}>
      <Form
        mutators={{ setNewResolutions }}
        onSubmit={applyChanges}
        initialValues={initialResolutions}
        render={({ form, handleSubmit, valid, pristine }) => (
          <form onSubmit={handleSubmit}>
            <div className={settingsStyles.labelWrapper} data-qa="metrics-resolution-label">
              <span>{label}</span>
              <LinkTooltip tooltipText={tooltip} link={link} linkText={tooltipLinkText} icon="info-circle" />
            </div>
            <RadioButtonGroup
              options={resolutionsOptions}
              selected={resolution}
              name="resolutions"
              dataQa="metrics-resolution-radio-button-group"
              className={styles.resolutionsRadioButtonGroup}
              onChange={form.mutators.setNewResolutions}
            />
            <div style={{ width: '100px' }}>
              <NumberInputField
                label={low}
                name={MetricsResolutionIntervals.lr}
                disabled={resolution !== MetricsResolutionPresets.custom}
                data-qa="metrics-resolution-lr-input"
                validators={resolutionValidators}
              />
            </div>
            <div style={{ width: '100px' }}>
              <NumberInputField
                label={medium}
                name={MetricsResolutionIntervals.mr}
                disabled={resolution !== MetricsResolutionPresets.custom}
                data-qa="metrics-resolution-mr-input"
                validators={resolutionValidators}
              />
            </div>
            <div style={{ width: '100px' }}>
              <NumberInputField
                label={high}
                name={MetricsResolutionIntervals.hr}
                disabled={resolution !== MetricsResolutionPresets.custom}
                data-qa="metrics-resolution-hr-input"
                validators={resolutionValidators}
              />
            </div>
            <Button
              className={settingsStyles.actionButton}
              type="submit"
              disabled={!valid || pristine || loading}
              data-qa="metrics-resolution-button"
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
