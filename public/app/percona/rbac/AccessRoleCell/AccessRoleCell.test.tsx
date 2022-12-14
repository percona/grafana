import { render, screen } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';

import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import AccessRolesEnabledCheck from '../AccessRolesEnabledCheck/AccessRolesEnabledCheck';
import { stubRoles, stubUsers, stubUserSingleRole, stubUsersMap, subUserMultipleRoles } from '../__mocks__/stubs';

import AccessRoleCell from './AccessRoleCell';

const wrapWithTable = (element: ReactElement) => (
  <table>
    <tbody>
      <tr>
        <AccessRolesEnabledCheck>{element}</AccessRolesEnabledCheck>
      </tr>
    </tbody>
  </table>
);

const wrapWithProvider = (element: ReactElement, enableAccessControl = true) => (
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
    {wrapWithTable(element)}
  </Provider>
);

describe('AccessRoleCell', () => {
  it('shows cell when access roles enabled', () => {
    render(wrapWithProvider(<AccessRoleCell user={stubUserSingleRole} />));

    const select = screen.queryByLabelText('Access Roles');

    expect(select).toBeInTheDocument();
  });

  it("doesn't cell select when access roles disabled", () => {
    render(wrapWithProvider(<AccessRoleCell user={stubUserSingleRole} />, false));

    const select = screen.queryByLabelText('Access Roles');

    expect(select).not.toBeInTheDocument();
  });

  it('shows the current users role', () => {
    render(wrapWithProvider(<AccessRoleCell user={stubUserSingleRole} />));

    const option = screen.queryByText(stubRoles[0].title);

    expect(option).toBeInTheDocument();
  });

  it('shows the current users roles', () => {
    render(wrapWithProvider(<AccessRoleCell user={subUserMultipleRoles} />));

    const option1 = screen.queryByText(stubRoles[0].title);
    const option2 = screen.queryByText(stubRoles[1].title);

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });
});
