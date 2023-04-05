import { useEffect } from 'react';

import { AssignRoleParams } from 'app/percona/shared/core/reducers/roles/role.types';
import { assignRoleAction, fetchRolesAction } from 'app/percona/shared/core/reducers/roles/roles';
import { getPerconaSettings } from 'app/percona/shared/core/selectors';
import { AccessRoleEntity } from 'app/percona/shared/services/roles/Roles.types';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

export const useAccessRolesTeam = () => {
  const dispatch = useAppDispatch();
  const { result } = useSelector(getPerconaSettings);

  const submitTeamAccessRoles = async (teamId: number, roleIds: number[]) => {
    const payload: AssignRoleParams = {
      roleIds: roleIds,
      entityId: teamId,
      entityType: AccessRoleEntity.team,
    };
    if (result?.enableAccessControl) {
      await dispatch(assignRoleAction(payload));
    }
  };

  useEffect(() => {
    dispatch(fetchRolesAction());
  }, [dispatch]);

  return { submitTeamAccessRoles };
};
