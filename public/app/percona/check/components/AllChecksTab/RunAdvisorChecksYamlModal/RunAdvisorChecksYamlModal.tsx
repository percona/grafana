import { FormApi } from 'final-form';
import { ChangeEvent, FC, useCallback, useRef, useState } from 'react';
import { Form } from 'react-final-form';

import { AppEvents } from '@grafana/data';
import { Button, HorizontalGroup, Icon, useStyles2 } from '@grafana/ui';
import { appEvents } from 'app/core/app_events';
import { CheckService } from 'app/percona/check/Check.service';
import { LoaderButton } from 'app/percona/shared/components/Elements/LoaderButton';
import { Modal } from 'app/percona/shared/components/Elements/Modal';
import { TextareaInputField } from 'app/percona/shared/components/Form/TextareaInput';
import { logger } from 'app/percona/shared/helpers/logger';
import { validators } from 'app/percona/shared/helpers/validatorsForm';

import { CheckResults } from './CheckResults';
import { Messages } from './RunAdvisorChecksYamlModal.messages';
import { getStyles } from './RunAdvisorChecksYamlModal.styles';
import {
  RunAdvisorChecksYamlModalProps,
  CheckYamlFormValues,
  CheckResultsState,
} from './RunAdvisorChecksYamlModal.types';

export const RunAdvisorChecksYamlModal: FC<RunAdvisorChecksYamlModalProps> = ({ isVisible, setVisible }) => {
  const styles = useStyles2(getStyles);
  const { required } = validators;
  const inputRef = useRef<HTMLInputElement>(null);
  const [checkResults, setCheckResults] = useState<CheckResultsState>({
    results: [],
    hasRun: false,
  });

  const onUploadFile = useCallback(
    (change: FormApi['change']) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
      const reader = new FileReader();

      if (file) {
        reader.addEventListener('load', (e) => {
          change('yaml', e.target?.result);
          // Reset results when a new file is uploaded
          setCheckResults({ results: [], hasRun: false });
        });
        reader.readAsText(file);
      }
    },
    []
  );

  const onSubmit = async (values: CheckYamlFormValues) => {
    try {
      const results = await CheckService.runCheckFile(values.yaml);
      setCheckResults({ results, hasRun: true });
      appEvents.emit(AppEvents.alertSuccess, [Messages.success]);
    } catch (e) {
      logger.error(e);
      setCheckResults({ results: [], hasRun: false });
    }
  };

  const handleClose = () => {
    setVisible(false);
    // Reset results when modal is closed
    setCheckResults({ results: [], hasRun: false });
  };

  return (
    <Modal title={Messages.title} isVisible={isVisible} onClose={handleClose}>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, valid, pristine, submitting, form: { change } }) => (
          <form onSubmit={handleSubmit} data-testid="run-advisor-checks-yaml-modal-form">
            <>
              <input type="file" accept=".yml, .yaml" ref={inputRef} onChange={onUploadFile(change)} hidden />
              <TextareaInputField
                name="yaml"
                label={Messages.yamlLabel}
                placeholder={Messages.yamlPlaceholder}
                validators={[required]}
                className={styles.yamlTextarea}
              />
              <Button
                type="button"
                data-testid="advisor-checks-upload-button"
                size="md"
                variant="secondary"
                className={styles.uploadAction}
                onClick={() => inputRef.current?.click()}
              >
                <Icon name="upload" />
                {Messages.uploadButton}
              </Button>

              {checkResults.hasRun && <CheckResults results={checkResults.results} />}

              <HorizontalGroup justify="center" spacing="md" className={styles.buttonGroup}>
                <LoaderButton
                  data-testid="advisor-checks-run-button"
                  size="md"
                  variant="primary"
                  disabled={!valid || pristine}
                  type="submit"
                  loading={submitting}
                >
                  {Messages.runButton}
                </LoaderButton>
                <Button data-testid="advisor-checks-close-button" variant="secondary" onClick={handleClose}>
                  {Messages.closeButton}
                </Button>
              </HorizontalGroup>
            </>
          </form>
        )}
      />
    </Modal>
  );
};
