import React, { FC, useEffect, useMemo, useState } from 'react';

import { SelectableValue } from '@grafana/data';
import { MultiSelect } from '@grafana/ui';
import { assignRoleAction } from 'app/percona/shared/core/reducers/roles/roles';
import { getAccessRoles, getUsersInfo } from 'app/percona/shared/core/selectors';
import { useAppDispatch } from 'app/store/store';
import { OrgUser, useSelector } from 'app/types';

import { idsToOptions, toOptions } from './AccessRoleCell.utils';

interface AccessRoleCellProps {
  user: OrgUser;
}

const AccessRoleCell: FC<AccessRoleCellProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const { roles, isLoading: rolesLoading } = useSelector(getAccessRoles);
  const { usersMap, isLoading: usersLoading } = useSelector(getUsersInfo);
  const roleIds = useMemo<number[]>(() => usersMap[user.userId]?.roleIds || [], [usersMap, user.userId]);
  const options = useMemo<Array<SelectableValue<number>>>(() => toOptions(roles), [roles]);
  const [value, setValue] = useState<Array<SelectableValue<number>>>([]);

  useEffect(() => {
    setValue(idsToOptions(roleIds));
  }, [roleIds]);

  const handleChange = (roleIds: Array<SelectableValue<number>>) => {
    setValue(roleIds);
    const ids = roleIds.map((v) => Number(v.value));
    dispatch(
      assignRoleAction({
        roleIds: ids,
        userId: user.userId,
      })
    );
  };

  return (
    <td>
      <MultiSelect
        closeMenuOnSelect={false}
        value={value}
        options={options}
        onChange={handleChange}
        isLoading={rolesLoading || usersLoading}
      />
    </td>
  );
};

export default AccessRoleCell;
