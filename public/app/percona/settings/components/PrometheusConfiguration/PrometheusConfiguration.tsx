import { Label, logger } from '@percona/platform-core';
import React, { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';

import { AppEvents } from '@grafana/data';
import { Button, TextArea, useStyles2 } from '@grafana/ui';
import appEvents from 'app/core/app_events';
import { OldPage } from 'app/core/components/Page/Page';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { FileService } from 'app/percona/shared/services/file/File.service';

import { getSettingsStyles } from '../../Settings.styles';

import { PROMETHEUS_BASE_FILE } from './PrometheusConfiguration.constants';
import { Messages } from './PrometheusConfiguration.messages';
import { getStyles } from './PrometheusConfiguration.styles';
import { PrometheusFormValues } from './PrometheusConfiguration.types';

export const PrometheusConfiguration: React.FC = () => {
  const styles = useStyles2(getStyles);
  const settingsStyles = useStyles2(getSettingsStyles);
  const navModel = usePerconaNavModel('settings-prometheus-configuration');
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<PrometheusFormValues>();

  const fetchConfiguration = async () => {
    const result = await FileService.get(PROMETHEUS_BASE_FILE);

    setInitialValues({
      configuration: result.content || '',
    });

    setIsLoading(false);
  };

  const handleSubmit = async (values: PrometheusFormValues) => {
    try {
      await FileService.update({
        name: PROMETHEUS_BASE_FILE,
        content: values.configuration,
      });

      appEvents.emit(AppEvents.alertSuccess, [Messages.success]);
    } catch (error) {
      logger.error(error);
    }
  };

  useEffect(() => {
    fetchConfiguration();
  }, []);

  return (
    <OldPage navModel={navModel} vertical tabsDataTestId="settings-tabs">
      <OldPage.Contents dataTestId="settings-tab-content" className={settingsStyles.pageContent} isLoading={isLoading}>
        <FeatureLoader>
          <p>
            {Messages.description}
            {/* TODO: add docs link */}
            <a className={styles.link} href="/">
              {Messages.docs}
            </a>
            {Messages.dot}
          </p>
          <Form
            initialValues={initialValues}
            onSubmit={handleSubmit}
            render={({ dirty, handleSubmit, submitting }) => (
              <>
                <Label name="configuration" label={Messages.label} />
                <Field
                  name="configuration"
                  render={({ input }) => (
                    <TextArea {...input} className={styles.configuration} data-testid="configuration-input" />
                  )}
                />
                <Button
                  data-testid="submit-configuration"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={submitting || !dirty}
                >
                  {Messages.submit}
                </Button>
              </>
            )}
          />
        </FeatureLoader>
      </OldPage.Contents>
    </OldPage>
  );
};

export default PrometheusConfiguration;
