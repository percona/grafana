import React, { FC, useMemo } from 'react';

import { AppEvents } from '@grafana/data';
import appEvents from 'app/core/app_events';
import { getTeamDetails } from 'app/percona/shared/core/selectors';
import { useSelector } from 'app/types';

import AccessRolesSelect from '../../AccessRolesSelect';
import { useAccessRolesTeam } from '../../hooks';

import { Messages } from './AccessRolesTeamSelect.messages';
import { AccessRolesTeamSelectProps } from './AccessRolesTeamSelect.types';

const AccessRolesTeamSelect: FC<AccessRolesTeamSelectProps> = ({ id, name }) => {
  const { detailsMap, isLoading: teamLoading } = useSelector(getTeamDetails);
  const roleIds = useMemo<number[]>(() => detailsMap[id]?.roleIds || [], [detailsMap, id]);
  const { submitTeamAccessRoles } = useAccessRolesTeam();

  const handleChange = async (ids: number[]) => {
    await submitTeamAccessRoles(id, ids);
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
