import React, { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';

import { AppEvents } from '@grafana/data';
import { Button, TextArea, useStyles2 } from '@grafana/ui';
import appEvents from 'app/core/app_events';
import { OldPage } from 'app/core/components/Page/Page';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { LabelCore } from 'app/percona/shared/components/Form/LabelCore';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { logger } from 'app/percona/shared/helpers/logger';
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
    try {
      const result = await FileService.get(PROMETHEUS_BASE_FILE);

      setInitialValues({
        configuration: result.content ? window.atob(result.content) : '',
      });
    } catch (error) {
      logger.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: PrometheusFormValues) => {
    try {
      await FileService.update({
        name: PROMETHEUS_BASE_FILE,
        content: values.configuration ? window.btoa(values.configuration) : '',
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
            {/* TODO: add back in when docs link is available */}
            {/* {Messages.needHelp}
            <a rel="noopener noreferrer" target="_blank" className={styles.link} href="/">
              {Messages.docs}
            </a> 
            {Messages.dot} */}
          </p>
          <Form
            initialValues={initialValues}
            onSubmit={handleSubmit}
            render={({ dirty, handleSubmit, submitting }) => (
              <>
                <LabelCore name="configuration" label={Messages.label} />
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
