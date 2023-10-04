import { css } from '@emotion/css';
import React from 'react';

import { Modal, Button, Form, Field, Input, useStyles2 } from '@grafana/ui';
import { SendToSupportForm } from 'app/percona/pmm-dump/PmmDump.types';
import { sendToSupportAction } from 'app/percona/shared/core/reducers/pmmDump/pmmDump';
import { getDumps } from 'app/percona/shared/core/selectors';
import { useDispatch, useSelector } from 'app/types';

interface ModalProps {
  onClose: (saved?: boolean) => void;
}

export function SendToSupportModal(props: ModalProps): React.ReactElement {
  const { onClose } = props;
  const styles = useStyles2(getStyles);
  const dispatch = useDispatch();
  const { isLoading } = useSelector(getDumps);
  const defaultValues: SendToSupportForm = {
    name: '',
    address: '',
    password: '',
  } as const;

  const onSubmit = (values: SendToSupportForm) => {
    dispatch(
      sendToSupportAction({
        name: values.name,
        address: values.address,
        password: values.password,
      })
    );
  };

  return (
    <Modal className={styles.modal} isOpen={true} title="Send to suport" onDismiss={onClose} onClickBackdrop={onClose}>
      <Form defaultValues={defaultValues} onSubmit={onSubmit} key={JSON.stringify(defaultValues)}>
        {({ register, errors, formState: { isDirty } }) => (
          <>
            <Field label="Address" invalid={!!errors.address} error={errors.address?.message}>
              <Input
                placeholder="sftp.percona.com"
                id="address"
                {...register('address', {
                  required: 'Address is required.',
                })}
              />
            </Field>
            <Field label="Name" invalid={!!errors.name} error={errors.name?.message}>
              <Input
                id="name"
                {...register('name', {
                  required: 'Name is required.',
                })}
              />
            </Field>
            <Field label="Password" invalid={!!errors.password} error={errors.password?.message}>
              <Input
                id="password"
                {...register('password', {
                  required: 'Password is required.',
                })}
              />
            </Field>

            <Modal.ButtonRow>
              <Button type="submit" disabled={!isDirty || isLoading}>
                {isLoading ? 'Saving...' : 'Send'}
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
}

const getStyles = () => ({
  modal: css`
    max-width: 560px;
  `,
});
