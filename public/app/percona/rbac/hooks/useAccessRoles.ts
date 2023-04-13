import { useCallback, useEffect } from 'react';

import { AssignRoleParams } from 'app/percona/shared/core/reducers/roles/role.types';
import { assignRoleAction, fetchRolesAction } from 'app/percona/shared/core/reducers/roles/roles';
import { getPerconaSettings } from 'app/percona/shared/core/selectors';
import { AccessRoleEntity } from 'app/percona/shared/services/roles/Roles.types';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

export const useAccessRoles = () => {
  const dispatch = useAppDispatch();
  const { result } = useSelector(getPerconaSettings);

  const submitAccessRoles = useCallback(
    async (entityId: number, roleIds: number[], entityType: AccessRoleEntity) => {
      const payload: AssignRoleParams = {
        roleIds,
        entityId,
        entityType,
      };
      if (result?.enableAccessControl) {
        await dispatch(assignRoleAction(payload));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [result?.enableAccessControl, dispatch]
  );

  const submitUserAccessRoles = useCallback(
    (entityId: number, roleIds: number[]) => submitAccessRoles(entityId, roleIds, AccessRoleEntity.user),
    [submitAccessRoles]
  );

  const submitTeamAccessRoles = useCallback(
    (entityId: number, roleIds: number[]) => submitAccessRoles(entityId, roleIds, AccessRoleEntity.team),
    [submitAccessRoles]
  );

  useEffect(() => {
    dispatch(fetchRolesAction());
  }, [dispatch]);

  return { submitAccessRoles, submitUserAccessRoles, submitTeamAccessRoles };
};
