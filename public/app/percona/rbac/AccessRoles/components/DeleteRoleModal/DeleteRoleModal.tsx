import { logger } from '@percona/platform-core';
import React, { FC } from 'react';

import { Button, Modal } from '@grafana/ui';
import { deleteRoleAction } from 'app/percona/shared/core/reducers/roles/roles';
import { useAppDispatch } from 'app/store/store';

import { Messages } from '../../AccessRole.messages';

import { DeleteRoleModalProps } from './DeleteRoleModal.types';

const DeleteRoleModal: FC<DeleteRoleModalProps> = ({ role, isOpen, onCancel }) => {
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteRoleAction({
          toDeleteId: role.roleId,
        })
      );
      onCancel();
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Modal isOpen={isOpen} title={Messages.delete.title(role.title)} onDismiss={onCancel}>
      <p>{Messages.delete.description(role.title)}</p>
      <Modal.ButtonRow>
        <Button onClick={handleDelete}>{Messages.delete.submit}</Button>
        <Button variant="secondary" onClick={onCancel}>
          {Messages.delete.cancel}
        </Button>
      </Modal.ButtonRow>
    </Modal>
  );
};

export default DeleteRoleModal;
