import { AccessRole, AccessRoleEntity } from 'app/percona/shared/services/roles/Roles.types';

export interface RolesState {
  isLoading: boolean;
  roles: AccessRole[];
}

export interface AssignRoleParams {
  entityId: number;
  roleIds: number[];
  entityType: AccessRoleEntity;
}
