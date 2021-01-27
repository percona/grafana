import React, { FC, useContext, useCallback } from 'react';
import { withTypes, Field } from 'react-final-form';
import { HorizontalGroup, Select, Button, useStyles } from '@grafana/ui';
import { AppEvents } from '@grafana/data';
import { Modal, LoaderButton, TextInputField, validators, logger } from '@percona/platform-core';
import { appEvents } from 'app/core/core';
import { NotificationChannelProvider } from '../NotificationChannel.provider';
import { MutatorKeys, NotificationChannelRenderProps, PagerDutyKeyType } from '../NotificationChannel.types';
import { AddNotificationChannelModalProps } from './AddNotificationChannelModal.types';
import { getStyles } from './AddNotificationChannelModal.styles';
import { Messages } from './AddNotificationChannelModal.messages';
import { TYPE_OPTIONS, TYPE_FIELDS_COMPONENT } from './AddNotificationChannel.constants';
import { NotificationChannelService } from '../NotificationChannel.service';
import { getInitialValues } from './AddNotificationChannelModal.utils';
import { Mutator } from 'final-form';

const { required } = validators;
// Our "values" typings won't be right without using this
const { Form } = withTypes<NotificationChannelRenderProps>();

export const AddNotificationChannelModal: FC<AddNotificationChannelModalProps> = ({
  isVisible,
  notificationChannel,
  setVisible,
}) => {
  const styles = useStyles(getStyles);
  const initialValues = getInitialValues(notificationChannel);
  const { getNotificationChannels } = useContext(NotificationChannelProvider);
  const onSubmit = async (values: NotificationChannelRenderProps) => {
    try {
      if (notificationChannel) {
        await NotificationChannelService.change(notificationChannel.channelId, values);
      } else {
        await NotificationChannelService.add(values);
      }
      setVisible(false);
      appEvents.emit(AppEvents.alertSuccess, [notificationChannel ? Messages.editSuccess : Messages.addSuccess]);
      getNotificationChannels();
    } catch (e) {
      logger.error(e);
    }
  };
  const renderTypeFields = useCallback(
    (values: NotificationChannelRenderProps, mutators: Record<string, (...args: any[]) => any>) => {
      const TypeFields = TYPE_FIELDS_COMPONENT[values.type.value];

      // By passing down the mutators, these fields will be able to call them
      return <TypeFields values={values} mutators={mutators} />;
    },
    []
  );

  const mutators: Record<
    MutatorKeys,
    Mutator<NotificationChannelRenderProps, Partial<NotificationChannelRenderProps>>
  > = {
    // Insead of just resetting the value to '', we'll use the initial value
    // This way, it keeps working on edition mode
    resetKey: ([key]: PagerDutyKeyType[], state, utils) => {
      utils.changeValue(state, key, () => initialValues[key]);
    },
  };

  return (
    <Modal title={Messages.title} isVisible={isVisible} onClose={() => setVisible(false)}>
      <Form
        mutators={mutators}
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({ form, handleSubmit, valid, pristine, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <>
              <TextInputField name="name" label={Messages.fields.name} validators={[required]} />
              <Field name="type">
                {({ input }) => (
                  <>
                    <label className={styles.label} data-qa="type-field-label">
                      {Messages.fields.type}
                    </label>
                    <Select className={styles.select} options={TYPE_OPTIONS} {...input} />
                  </>
                )}
              </Field>
              {renderTypeFields(values, form.mutators)}
              <HorizontalGroup justify="center" spacing="md">
                <LoaderButton
                  data-qa="notification-channel-add-button"
                  size="md"
                  variant="primary"
                  disabled={!valid || pristine}
                  loading={submitting}
                >
                  {notificationChannel ? Messages.editAction : Messages.addAction}
                </LoaderButton>
                <Button
                  data-qa="notification-channel-cancel-button"
                  variant="secondary"
                  onClick={() => setVisible(false)}
                >
                  {Messages.cancelAction}
                </Button>
              </HorizontalGroup>
            </>
          </form>
        )}
      />
    </Modal>
  );
};
