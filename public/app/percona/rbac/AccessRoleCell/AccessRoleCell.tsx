import React, { FC, useMemo } from 'react';

import { AppEvents } from '@grafana/data';
import appEvents from 'app/core/app_events';
import { AssignRoleParams } from 'app/percona/shared/core/reducers/roles/role.types';
import { assignRoleAction } from 'app/percona/shared/core/reducers/roles/roles';
import { getUsersInfo } from 'app/percona/shared/core/selectors';
import { AccessRoleEntity } from 'app/percona/shared/services/roles/Roles.types';
import { useAppDispatch } from 'app/store/store';
import { OrgUser, useSelector } from 'app/types';

import AccessRolesSelect from '../AccessRolesSelect/AccessRolesSelect';

import { Messages } from './AccessRoleCell.messages';

interface AccessRoleCellProps {
  user: OrgUser;
}

const AccessRoleCell: FC<AccessRoleCellProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const { usersMap, isLoading: usersLoading } = useSelector(getUsersInfo);
  const roleIds = useMemo<number[]>(() => usersMap[user.userId]?.roleIds || [], [usersMap, user.userId]);

  const handleChange = async (ids: number[]) => {
    const payload: AssignRoleParams = {
      roleIds: ids,
      entityId: user.userId,
      entityType: AccessRoleEntity.user,
    };
    await dispatch(assignRoleAction(payload));
    appEvents.emit(AppEvents.alertSuccess, [Messages.success.title(user.name || user.login), Messages.success.body]);
  };

  return (
    <td>
      <AccessRolesSelect label={Messages.label} isLoading={usersLoading} roleIds={roleIds} onChange={handleChange} />
    </td>
  );
};

export default AccessRoleCell;
