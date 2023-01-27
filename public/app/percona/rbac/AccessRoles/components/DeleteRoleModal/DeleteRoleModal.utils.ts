import { SelectableValue } from '@grafana/data';
import { AccessRole } from 'app/percona/shared/services/roles/Roles.types';

import { DeleteRoleFormValues } from './DeleteRoleModal.types';

export const getOptions = (roles: AccessRole[], roleToDelete: AccessRole): SelectableValue[] =>
  roles.filter((role) => role.roleId !== roleToDelete.roleId).map(roleToOption);

export const roleToOption = (role: AccessRole): SelectableValue<number> => ({
  label: role.title,
  value: role.roleId,
});

export const getDefaultFormValues = (defaultRole?: AccessRole): DeleteRoleFormValues | undefined =>
  defaultRole
    ? {
        replacementRoleId: roleToOption(defaultRole),
      }
    : undefined;
