import { render, screen } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';

import * as RolesReducer from 'app/percona/shared/core/reducers/roles/roles';
import * as UsersReducer from 'app/percona/shared/core/reducers/users/users';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import { stubRoles, stubUsers, stubUsersMap } from '../../__mocks__/stubs';

import { AccessRolesUserHeader } from './AccessRolesUserHeader';

const wrapWithProvider = (children: ReactElement) => (
  <Provider
    store={configureStore({
      percona: {
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
    <table>
      <thead>
        <tr>{children}</tr>
      </thead>
    </table>
  </Provider>
);

describe('AccessRolesUserHeader::', () => {
  it('renders correctly', () => {
    render(wrapWithProvider(<AccessRolesUserHeader />));
    expect(screen.getByTestId('access-role-header')).toHaveTextContent('Access Role');
  });

  it('fetches roles and users on render', () => {
    const fetchRolesActionSpy = jest.spyOn(RolesReducer, 'fetchRolesAction');
    const fetchUsersListActionSpy = jest.spyOn(UsersReducer, 'fetchUsersListAction');

    render(wrapWithProvider(<AccessRolesUserHeader />));

    expect(fetchRolesActionSpy).toHaveBeenCalled();
    expect(fetchUsersListActionSpy).toHaveBeenCalled();
  });
});
