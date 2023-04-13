import { render, screen } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';

import * as RolesReducer from 'app/percona/shared/core/reducers/roles/roles';
import * as TeamReducer from 'app/percona/shared/core/reducers/team/team';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import { stubRoles, stubTeamDetails, stubTeamDetailsMap } from '../../__mocks__/stubs';

import { AccessRolesTeamHeader } from './AccessRolesTeamHeader';

const withProvider = (children: ReactElement) => (
  <Provider
    store={configureStore({
      percona: {
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
    <table>
      <thead>
        <tr>{children}</tr>
      </thead>
    </table>
  </Provider>
);

describe('AccessRolesTeamHeader::', () => {
  it('renders correctly', () => {
    render(withProvider(<AccessRolesTeamHeader />));
    expect(screen.getByTestId('access-role-header')).toHaveTextContent('Access Role');
  });

  it('fetches roles and users on render', () => {
    const fetchRolesActionSpy = jest.spyOn(RolesReducer, 'fetchRolesAction');
    const fetchTeamDetailsActionSpy = jest.spyOn(TeamReducer, 'fetchTeamDetailsAction');

    render(withProvider(<AccessRolesTeamHeader />));

    expect(fetchRolesActionSpy).toHaveBeenCalled();
    expect(fetchTeamDetailsActionSpy).toHaveBeenCalled();
  });
});
