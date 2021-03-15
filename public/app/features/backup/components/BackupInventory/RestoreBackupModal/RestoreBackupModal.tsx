import React, { FC } from 'react';
import { Modal } from '@grafana/ui';
import { withTypes } from 'react-final-form';
import { RestoreBackupModalProps, RestoreBackupFormProps } from './RestoreBackupModal.types';

const { Form } = withTypes<RestoreBackupFormProps>();

export const RestoreBackupModal: FC<RestoreBackupModalProps> = ({ backup, isVisible }) => {
  const handleSubmit = () => {};

  return (
    <Modal title="Restore from backup">
      <Form
        onSubmit={handleSubmit}
        render={({ handleSubmit, valid, pristine, submitting }) => <form onSubmit={handleSubmit}></form>}
      />
    </Modal>
  );
};
