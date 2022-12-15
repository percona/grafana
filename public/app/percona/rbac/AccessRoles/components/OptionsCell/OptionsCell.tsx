import { logger } from '@percona/platform-core';
import React, { FC, useMemo, useState } from 'react';

import { locationService } from '@grafana/runtime';
import { Dropdown, IconButton, Menu, useStyles2 } from '@grafana/ui';
import { fetchSettingsAction } from 'app/percona/shared/core/reducers';
import { setAsDefaultRoleAction } from 'app/percona/shared/core/reducers/roles/roles';
import { getDefaultRole } from 'app/percona/shared/core/selectors';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import { Messages } from '../../AccessRole.messages';
import DeleteRoleModal from '../DeleteRoleModal';

import { getStyles } from './OptionsCell.styles';
import { OptionsCellProps } from './OptionsCell.types';

const OptionsCell: FC<OptionsCellProps> = ({ role }) => {
  const styles = useStyles2(getStyles);
  const dispatch = useAppDispatch();
  const defaultRole = useSelector(getDefaultRole);
  const isDefault = useMemo(() => defaultRole?.roleId === role.roleId, [role, defaultRole]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleSetAsDefault = async () => {
    if (isDefault) {
      return;
    }

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
    if (isDefault) {
      return;
    }

    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  const menu = () => (
    <Menu>
      <Menu.Item label={Messages.options.edit} icon="pen" onClick={handleEdit} />
      <Menu.Item
        label={Messages.options.default}
        className={isDefault ? styles.Disabled : ''}
        icon="user-check"
        onClick={handleSetAsDefault}
      />
      <Menu.Item
        label={Messages.options.delete}
        className={isDefault ? styles.Disabled : ''}
        icon="trash-alt"
        onClick={handleDelete}
      />
    </Menu>
  );

  return (
    <div className={styles.Cell}>
      <DeleteRoleModal isOpen={deleteModalOpen} onCancel={handleDeleteCancel} role={role} />
      <Dropdown overlay={menu}>
        <IconButton name="ellipsis-v" />
      </Dropdown>
    </div>
  );
};

export default OptionsCell;
