import React, { FC, useState } from 'react';
import { Button, useStyles } from '@grafana/ui';
import { Form } from 'react-final-form';
import { TextInputField, validators } from '@percona/platform-core';
import { getStyles } from './TestEmailSettings.styles';
import { Messages } from './TestEmailSettings.messages';

interface TestEmailSettingsProps {
  onTest: (email: string) => Promise<void>;
}

export const TestEmailSettings: FC<TestEmailSettingsProps> = ({ onTest }) => {
  const [testingSettings, setTestingSettings] = useState(false);
  const styles = useStyles(getStyles);

  const handleClick = async (email: string) => {
    setTestingSettings(true);
    await onTest(email);
    setTestingSettings(false);
  };

  return (
    <Form
      onSubmit={() => {}}
      render={({ values, valid }) => (
        <form className={styles.form}>
          <TextInputField
            name="testEmail"
            label={Messages.testEmail}
            tooltipText={Messages.tooltip}
            validators={[validators.email]}
          />
          <Button
            className={styles.button}
            disabled={testingSettings || !values.testEmail || !valid}
            onClick={() => handleClick(values.testEmail)}
          >
            {Messages.test}
          </Button>
        </form>
      )}
    ></Form>
  );
};
