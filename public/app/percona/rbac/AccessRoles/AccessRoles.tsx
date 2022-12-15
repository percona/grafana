import React, { FC, useEffect, useMemo } from 'react';

import { locationService } from '@grafana/runtime';
import { Button, useStyles2 } from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';
import { fetchRolesAction } from 'app/percona/shared/core/reducers/roles/roles';
import { getPerconaSettings, getAccessRoles } from 'app/percona/shared/core/selectors';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import { Messages } from './AccessRole.messages';
import { getStyles } from './AccessRole.styles';
import { toAccessRoleRow, orderRole } from './AccessRole.utils';
import AccessRolesTable from './components/AccessRolesTable/AccessRolesTable';

const AccessRolesPage: FC = () => {
  const dispatch = useAppDispatch();
  const { result: settings } = useSelector(getPerconaSettings);
  const { isLoading, roles } = useSelector(getAccessRoles);
  const rows = useMemo(
    () => roles.map((role) => toAccessRoleRow(role, settings?.defaultRoleId)).sort(orderRole),
    [roles, settings?.defaultRoleId]
  );

  const styles = useStyles2(getStyles);

  useEffect(() => {
    dispatch(fetchRolesAction());
  }, [dispatch]);

  const handleCreate = () => {
    locationService.push('/roles/create');
  };

  return (
    <Page navId="rbac-roles">
      <Page.Contents isLoading={isLoading}>
        <h2 data-testid="access-roles-title">{Messages.title}</h2>
        <p className={styles.description}>
          {Messages.subtitle.text}
          <a className={styles.link}>{Messages.subtitle.link}</a>
          {Messages.subtitle.dot}
        </p>
        <div className={styles.createContainer}>
          <Button onClick={handleCreate}>{Messages.create}</Button>
        </div>
        <AccessRolesTable items={rows} />
      </Page.Contents>
    </Page>
  );
};

export default AccessRolesPage;
