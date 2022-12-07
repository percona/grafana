import React, { FC, useEffect } from 'react';

import { Icon, Tooltip } from '@grafana/ui';
import { fetchRolesAction } from 'app/percona/shared/core/reducers/roles/roles';
import { fetchUsersListAction } from 'app/percona/shared/core/reducers/users/users';
import { useAppDispatch } from 'app/store/store';

import { Messages } from './AccessRoleHeader.messages';
import { styles } from './AccessRoleHeader.styles';

const AccessRoleHeader: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchRolesAction());
    dispatch(fetchUsersListAction());
  }, [dispatch]);

  return (
    <th className={styles.Header}>
      <span>{Messages.header}</span>
      <span className={styles.Icon}>
        <Tooltip content={Messages.tooltip}>
          <Icon name="info-circle" />
        </Tooltip>
      </span>
    </th>
  );
};

export default AccessRoleHeader;
