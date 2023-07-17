import { render, screen } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';

import * as RolesReducer from 'app/percona/shared/core/reducers/roles/roles';
import { AccessRoleEntity } from 'app/percona/shared/services/roles/Roles.types';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import { stubRoles, stubUsers, stubUserSingleRole, stubUsersMap, subUserMultipleRoles } from '../../__mocks__/stubs';
import { AccessRolesEnabledCheck } from '../../components';

import { AccessRolesUserSelect } from './AccessRolesUserSelect';

const assignRoleActionSpy = jest.spyOn(RolesReducer, 'assignRoleAction');

const withProvider = (element: ReactElement, enableAccessControl = true) => (
  <Provider
    store={configureStore({
      percona: {
        settings: {
          result: {
            enableAccessControl,
          },
        },
        users: {
          isLoading: false,
          users: stubUsers,
          usersMap: stubUsersMap,
        },
        roles: {
          isLoading: false,
          roles: stubRoles,
        },
      },
    } as StoreState)}
  >
    <AccessRolesEnabledCheck>{element}</AccessRolesEnabledCheck>
  </Provider>
);

describe('AccessRolesUserSelect::', () => {
  beforeEach(() => {
    assignRoleActionSpy.mockClear();
  });

  it('shows when access roles are enabled', () => {
    render(withProvider(<AccessRolesUserSelect id={stubUserSingleRole.userId} name={stubUserSingleRole.name} />));

    const select = screen.queryByLabelText('Access Roles');

    expect(select).toBeInTheDocument();
  });

  it("isn't shown when access roles are disabled", () => {
    render(
      withProvider(<AccessRolesUserSelect id={stubUserSingleRole.userId} name={stubUserSingleRole.name} />, false)
    );

    const select = screen.queryByLabelText('Access Roles');

    expect(select).not.toBeInTheDocument();
  });

  it('shows the current users role', () => {
    render(withProvider(<AccessRolesUserSelect id={stubUserSingleRole.userId} name={stubUserSingleRole.name} />));

    const option = screen.queryByText(stubRoles[0].title);

    expect(option).toBeInTheDocument();
  });

  it('shows the current users roles', () => {
    render(withProvider(<AccessRolesUserSelect id={subUserMultipleRoles.userId} name={subUserMultipleRoles.name} />));

    const option1 = screen.queryByText(stubRoles[0].title);
    const option2 = screen.queryByText(stubRoles[1].title);

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });

  it('calls api when role has been selected', async () => {
    render(withProvider(<AccessRolesUserSelect id={stubUserSingleRole.userId} name={stubUserSingleRole.name} />));

    const roleSelect = screen.getByLabelText('Access Roles');

    await selectEvent.select(roleSelect, ['Role #1', 'Role #2'], { container: document.body });

    expect(assignRoleActionSpy).toHaveBeenCalledWith({
      entityId: 2,
      roleIds: [1, 2],
      entityType: AccessRoleEntity.user,
    });
  });

  it('calls api when role has been removed', async () => {
    render(withProvider(<AccessRolesUserSelect id={subUserMultipleRoles.userId} name={subUserMultipleRoles.name} />));

    const removeButton = screen.getByLabelText('Remove Role #1');

    removeButton.click();

    expect(assignRoleActionSpy).toHaveBeenCalledWith({
      entityId: 3,
      roleIds: [2],
      entityType: AccessRoleEntity.user,
    });
  });
});
