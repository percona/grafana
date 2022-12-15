import { logger } from '@percona/platform-core';
import React, { FC } from 'react';

import { Button, Modal } from '@grafana/ui';
import { deleteRoleAction } from 'app/percona/shared/core/reducers/roles/roles';
import { getDefaultRole } from 'app/percona/shared/core/selectors';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import { Messages } from '../../AccessRole.messages';

import { DeleteRoleModalProps } from './DeleteRoleModal.types';

const DeleteRoleModal: FC<DeleteRoleModalProps> = ({ role, isOpen, onCancel }) => {
  const dispatch = useAppDispatch();
  const defaultRole = useSelector(getDefaultRole);

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
      <p>{Messages.delete.description(role.title, defaultRole?.title || '')}</p>
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
