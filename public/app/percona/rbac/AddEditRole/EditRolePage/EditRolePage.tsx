import { logger } from '@percona/platform-core';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AppEvents } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Page } from 'app/core/components/Page/Page';
import { appEvents } from 'app/core/core';
import { updateRoleAction } from 'app/percona/shared/core/reducers/roles/roles';
import RolesService from 'app/percona/shared/services/roles/Roles.service';
import { useAppDispatch } from 'app/store/store';

import AddEditRoleForm, { AddEditFormValues } from '../components/AddEditRoleForm';

import { Messages } from './EditRolePage.messages';
import { EditRolePageParams } from './EditRolePage.types';

const EditRolePage: FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<EditRolePageParams>();
  const [role, setRole] = useState<AddEditFormValues>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async (id: string) => {
      setIsLoading(true);
      try {
        const role = await RolesService.get(parseInt(id, 10));
        setRole(role);
      } catch (error) {
        logger.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRole(id);
    }
  }, [id]);

  const handleSubmit = async (values: AddEditFormValues) => {
    if (!id) {
      return;
    }

    try {
      await dispatch(
        updateRoleAction({
          roleId: Number(id),
          ...values,
        })
      ).unwrap();
      appEvents.emit(AppEvents.alertSuccess, [Messages.success.title(values.title), Messages.success.body]);
      locationService.push('/roles');
    } catch (e) {
      logger.error(e);
    }
  };

  const handleCancel = () => {
    locationService.push('/roles');
  };

  return (
    <Page>
      <AddEditRoleForm
        isLoading={isLoading}
        initialValues={role}
        title={Messages.title}
        cancelLabel={Messages.cancel}
        onCancel={handleCancel}
        submitLabel={Messages.submit}
        onSubmit={handleSubmit}
      />
    </Page>
  );
};

export default EditRolePage;
