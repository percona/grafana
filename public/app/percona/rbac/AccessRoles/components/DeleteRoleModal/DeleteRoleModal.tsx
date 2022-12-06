import { logger } from '@percona/platform-core';
import React, { FC, useState } from 'react';

import { Button, Label, Modal, Select } from '@grafana/ui';
import { deleteRoleAction } from 'app/percona/shared/core/reducers/roles/roles';
import { getAccessRoles } from 'app/percona/shared/core/selectors';
import { AccessRole } from 'app/percona/shared/services/roles/Roles.types';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import { Messages } from '../../AccessRole.messages';

import { DeleteRoleModalProps } from './DeleteRoleModal.types';

const DeleteRoleModal: FC<DeleteRoleModalProps> = ({ role, isOpen, onCancel }) => {
  const dispatch = useAppDispatch();
  const { roles } = useSelector(getAccessRoles);
  const [selectedRole, setSelectedRole] = useState<AccessRole>();

  const handleOnSubmit = async () => {
    if (selectedRole) {
      try {
        await dispatch(
          deleteRoleAction({
            toDeleteId: role.roleId,
            changeToId: selectedRole?.roleId,
          })
        );
        onCancel();
      } catch (e) {
        logger.error(e);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} title={Messages.delete.title(role.title)} onDismiss={onCancel}>
      <p>{Messages.delete.description(role.title)}</p>
      <div>
        <Label itemID="roles-select">{Messages.delete.newRole.label}</Label>
        <Select
          inputId="roles-select"
          value={selectedRole}
          onChange={({ value }) => setSelectedRole(value)}
          options={roles}
          getOptionLabel={(option) => option.title}
        />
      </div>
      <Modal.ButtonRow>
        <Button onClick={handleOnSubmit}>{Messages.delete.submit}</Button>
        <Button variant="secondary" onClick={onCancel}>
          {Messages.delete.cancel}
        </Button>
      </Modal.ButtonRow>
    </Modal>
  );
};

export default DeleteRoleModal;
