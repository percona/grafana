import React, { FC, useEffect, useMemo, useState } from 'react';

import { SelectableValue } from '@grafana/data';
import { Select } from '@grafana/ui';
import { getAccessRoles } from 'app/percona/shared/core/selectors';
import { useSelector } from 'app/types';

import { AccessRolesSelectProps } from './AccessRolesSelect.types';
import { idsToOptions, toOptions } from './AccessRolesSelect.utils';

export const AccessRolesSelect: FC<AccessRolesSelectProps> = ({ allowEmpty, label, isLoading, roleIds, onChange }) => {
  const { roles, isLoading: rolesLoading } = useSelector(getAccessRoles);
  const options = useMemo<Array<SelectableValue<number>>>(() => toOptions(roles), [roles]);
  const [value, setValue] = useState<Array<SelectableValue<number>>>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setValue(idsToOptions(roleIds, roles));
  }, [roles, roleIds]);

  const handleChange = async (selected: SelectableValue<number>) => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const roleIds = selected as Array<SelectableValue<number>>;
    setValue(roleIds);
    // value will always be defined
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const ids = roleIds.map((v) => v.value as number);
    onChange(ids);
  };

  return (
    <Select
      aria-label={label}
      isMulti={allowEmpty || isOpen || value.length !== 1}
      value={value}
      onChange={handleChange}
      options={options}
      isClearable={false}
      closeMenuOnSelect={false}
      isLoading={rolesLoading || isLoading}
      onOpenMenu={() => setIsOpen(true)}
      onCloseMenu={() => setIsOpen(false)}
    />
  );
};

export default AccessRolesSelect;
