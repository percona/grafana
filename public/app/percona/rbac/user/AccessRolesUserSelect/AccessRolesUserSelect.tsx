import React, { FC, useMemo } from 'react';

import { AppEvents } from '@grafana/data';
import appEvents from 'app/core/app_events';
import { getUsersInfo } from 'app/percona/shared/core/selectors';
import { useSelector } from 'app/types';

import AccessRolesSelect from '../../AccessRolesSelect';
import { useAccessRoles } from '../../hooks';

import { Messages } from './AccessRolesUserSelect.messages';
import { AccessRolesUserSelectProps } from './AccessRolesUserSelect.types';

export const AccessRolesUserSelect: FC<AccessRolesUserSelectProps> = ({ id, name }) => {
  const { usersMap, isLoading: usersLoading } = useSelector(getUsersInfo);
  const roleIds = useMemo<number[]>(() => usersMap[id]?.roleIds || [], [usersMap, id]);
  const { submitUserAccessRoles } = useAccessRoles();

  const handleChange = async (ids: number[]) => {
    await submitUserAccessRoles(id, ids);
    appEvents.emit(AppEvents.alertSuccess, [Messages.success.title(name), Messages.success.body]);
  };

  return (
    <AccessRolesSelect
      label={Messages.label}
      isLoading={usersLoading}
      roleIds={roleIds}
      onChange={handleChange}
      allowEmpty
    />
  );
};
