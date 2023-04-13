import { render, screen } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';

import * as RolesReducer from 'app/percona/shared/core/reducers/roles/roles';
import { AccessRoleEntity } from 'app/percona/shared/services/roles/Roles.types';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import AccessRolesEnabledCheck from '../../AccessRolesEnabledCheck';
import {
  stubRoles,
  stubTeamDetails,
  stubTeamDetailsMap,
  stubTeamMultiRoles,
  stubTeamSingleRole,
  stubUserSingleRole,
  subUserMultipleRoles,
} from '../../__mocks__/stubs';

import { AccessRolesTeamSelect } from './AccessRolesTeamSelect';

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
        team: {
          isLoading: false,
          details: stubTeamDetails,
          detailsMap: stubTeamDetailsMap,
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

describe('AccessRolesTeamSelect::', () => {
  beforeEach(() => {
    assignRoleActionSpy.mockClear();
  });

  it('shows when access roles are enabled', () => {
    render(withProvider(<AccessRolesTeamSelect {...stubTeamSingleRole} />));

    const select = screen.queryByLabelText('Access Roles');

    expect(select).toBeInTheDocument();
  });

  it("isn't shown when access roles are disabled", () => {
    render(withProvider(<AccessRolesTeamSelect {...stubTeamSingleRole} />, false));

    const select = screen.queryByLabelText('Access Roles');

    expect(select).not.toBeInTheDocument();
  });

  it('shows the current teams role', () => {
    render(withProvider(<AccessRolesTeamSelect {...stubTeamSingleRole} />));

    const option = screen.queryByText(stubRoles[0].title);

    expect(option).toBeInTheDocument();
  });

  it('shows the current teams roles', () => {
    render(withProvider(<AccessRolesTeamSelect {...stubTeamMultiRoles} />));

    const option1 = screen.queryByText(stubRoles[0].title);
    const option2 = screen.queryByText(stubRoles[1].title);

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });

  it('calls api when role has been selected', async () => {
    render(withProvider(<AccessRolesTeamSelect id={stubUserSingleRole.userId} name={stubUserSingleRole.name} />));

    const roleSelect = screen.getByLabelText('Access Roles');

    await selectEvent.select(roleSelect, ['Role #1', 'Role #2'], { container: document.body });

    expect(assignRoleActionSpy).toHaveBeenCalledWith({
      entityId: 2,
      roleIds: [1, 2],
      entityType: AccessRoleEntity.team,
    });
  });

  it('allows settings no roles', async () => {
    render(withProvider(<AccessRolesTeamSelect {...stubTeamSingleRole} />));

    const removeButton = screen.getByLabelText('Remove Role #1');

    removeButton.click();

    expect(assignRoleActionSpy).toHaveBeenCalledWith({
      entityId: 2,
      roleIds: [],
      entityType: AccessRoleEntity.team,
    });
  });

  it('calls api when role has been removed', async () => {
    render(withProvider(<AccessRolesTeamSelect id={subUserMultipleRoles.userId} name={subUserMultipleRoles.name} />));

    const removeButton = screen.getByLabelText('Remove Role #1');

    removeButton.click();

    expect(assignRoleActionSpy).toHaveBeenCalledWith({
      entityId: 3,
      roleIds: [2],
      entityType: AccessRoleEntity.team,
    });
  });
});
