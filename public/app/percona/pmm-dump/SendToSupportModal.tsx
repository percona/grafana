import { css } from '@emotion/css';
import React, { FC } from 'react';

import { Modal, Button, Form, Field, Input, useStyles2 } from '@grafana/ui';
import { Messages } from 'app/percona/pmm-dump/PMMDump.messages';
import { SendToSupportForm } from 'app/percona/pmm-dump/PmmDump.types';
import { sendToSupportAction } from 'app/percona/shared/core/reducers/pmmDump/pmmDump';
import { getDumps } from 'app/percona/shared/core/selectors';
import { useDispatch, useSelector } from 'app/types';

interface ModalProps {
  onClose: (saved?: boolean) => void;
  dumpIds: string[];
}

export const SendToSupportModal: FC<ModalProps> = ({ onClose, dumpIds }) => {
  const styles = useStyles2(getStyles);
  const dispatch = useDispatch();
  const { isLoading } = useSelector(getDumps);
  const defaultValues: SendToSupportForm = {
    user: '',
    address: '',
    password: '',
    dumpIds: [] as string[],
  };

  const onSubmit = (values: SendToSupportForm) => {
    dispatch(
      sendToSupportAction({
        sftp_parameters: {
          user: values.user,
          address: values.address,
          password: values.password,
        },
        dump_ids: dumpIds,
      })
    );
  };

  return (
    <Modal
      className={styles.modal}
      isOpen={true}
      title={Messages.dumps.actions.sendToSupport}
      onDismiss={onClose}
      onClickBackdrop={onClose}
    >
      <Form defaultValues={defaultValues} onSubmit={onSubmit} key={JSON.stringify(defaultValues)}>
        {({ register, errors, formState: { isDirty } }) => (
          <>
            <Field label="Address" invalid={!!errors.address} error={errors.address?.message}>
              <Input
                placeholder={Messages.dumps.actions.addressPlaceholder}
                id="address"
                {...register('address', {
                  required: Messages.dumps.actions.addressRequired,
                })}
              />
            </Field>
            <Field label="Name" invalid={!!errors.user} error={errors.user?.message}>
              <Input
                id="name"
                {...register('user', {
                  required: Messages.dumps.actions.nameRequired,
                })}
              />
            </Field>
            <Field label="Password" invalid={!!errors.password} error={errors.password?.message}>
              <Input
                id="password"
                {...register('password', {
                  required: Messages.dumps.actions.passwordRequired,
                })}
              />
            </Field>

            <Modal.ButtonRow>
              <Button type="submit" disabled={!isDirty || isLoading}>
                {isLoading ? Messages.dumps.actions.savingButton : Messages.dumps.actions.sendButton}
              </Button>
              <Button
                variant="secondary"
                type="button"
                disabled={isLoading}
                onClick={() => onClose(false)}
                fill="outline"
              >
                Cancel
              </Button>
            </Modal.ButtonRow>
          </>
        )}
      </Form>
    </Modal>
  );
};

const getStyles = () => ({
  modal: css`
    max-width: 560px;
  `,
});
