import { SelectableValue } from '@grafana/data';
import { AccessRole } from 'app/percona/shared/services/roles/Roles.types';

export const toOptions = (roles: AccessRole[]): Array<SelectableValue<number>> =>
  roles.map((role) => ({
    label: role.title,
    value: role.roleId,
  }));

export const idsToOptions = (ids: number[]): Array<SelectableValue<number>> =>
  ids.map((id) => ({
    value: id,
  }));
