import { logger } from '@percona/platform-core';
import React, { FC, useState } from 'react';

import { locationService } from '@grafana/runtime';
import { Menu } from '@grafana/ui';
import { fetchSettingsAction } from 'app/percona/shared/core/reducers';
import { setAsDefaultRoleAction } from 'app/percona/shared/core/reducers/roles/roles';
import { useAppDispatch } from 'app/store/store';

import { Messages } from '../../AccessRole.messages';
import DeleteRoleModal from '../DeleteRoleModal';

import { OptionsProps } from './Options.types';

const Options: FC<OptionsProps> = ({ role }) => {
  const dispatch = useAppDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleSetAsDefault = async () => {
    try {
      await dispatch(setAsDefaultRoleAction(role.roleId));
      await dispatch(fetchSettingsAction());
    } catch (e) {
      logger.error(e);
    }
  };

  const handleEdit = () => {
    locationService.push(`/roles/${role.roleId}/edit`);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  return (
    <>
      <DeleteRoleModal isOpen={deleteModalOpen} onCancel={handleDeleteCancel} role={role} />
      <Menu>
        <Menu.Item label={Messages.options.edit} icon="pen" onClick={handleEdit} />
        <Menu.Item label={Messages.options.default} icon="user-check" onClick={handleSetAsDefault} />
        <Menu.Item label={Messages.options.delete} icon="trash-alt" onClick={handleDelete} />
      </Menu>
    </>
  );
};

export default Options;
