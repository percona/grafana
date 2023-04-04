import React, { FC, useMemo } from 'react';

import { AppEvents } from '@grafana/data';
import appEvents from 'app/core/app_events';
import { AssignRoleParams } from 'app/percona/shared/core/reducers/roles/role.types';
import { assignRoleAction } from 'app/percona/shared/core/reducers/roles/roles';
import { getTeamDetails } from 'app/percona/shared/core/selectors';
import { AccessRoleEntity } from 'app/percona/shared/services/roles/Roles.types';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import AccessRolesSelect from '../../AccessRolesSelect';

import { Messages } from './AccessRolesTeamSelect.messages';
import { AccessRolesTeamSelectProps } from './AccessRolesTeamSelect.types';

const AccessRolesTeamSelect: FC<AccessRolesTeamSelectProps> = ({ id, name }) => {
  const dispatch = useAppDispatch();
  const { detailsMap, isLoading: teamLoading } = useSelector(getTeamDetails);
  const roleIds = useMemo<number[]>(() => detailsMap[id]?.roleIds || [], [detailsMap, id]);

  const handleChange = async (ids: number[]) => {
    const payload: AssignRoleParams = {
      roleIds: ids,
      entityId: id,
      entityType: AccessRoleEntity.team,
    };
    await dispatch(assignRoleAction(payload));
    appEvents.emit(AppEvents.alertSuccess, [Messages.success.title(name), Messages.success.body]);
  };

  return (
    <AccessRolesSelect
      label={Messages.label}
      isLoading={teamLoading}
      roleIds={roleIds}
      onChange={handleChange}
      allowEmpty
    />
  );
};

export default AccessRolesTeamSelect;
