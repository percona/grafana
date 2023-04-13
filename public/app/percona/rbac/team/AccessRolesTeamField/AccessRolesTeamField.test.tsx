import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';

import { Form } from '@grafana/ui';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import { stubRoles, stubTeamDetails, stubTeamDetailsMap } from '../../__mocks__/stubs';

import { AccessRolesTeamField } from './AccessRolesTeamField';

const onSubmitMock = jest.fn();

const withForm = (roleIds: number[] = []) => (
  <Provider
    store={configureStore({
      percona: {
        settings: {
          result: {
            enableAccessControl: true,
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
    <Form
      onSubmit={(values) => onSubmitMock(values)}
      defaultValues={{
        roleIds,
      }}
    >
      {({ control }) => (
        <>
          <AccessRolesTeamField control={control} />
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  </Provider>
);

describe('AccessRolesTeamField::', () => {
  beforeEach(() => {
    onSubmitMock.mockClear();
  });

  it('renders empty by default', () => {
    render(withForm());

    const options = stubRoles.map((role) => screen.queryByText(role.title));

    options.forEach((opt) => expect(opt).toBeNull());
  });

  it('renders prefilled values', () => {
    const roleIds = stubRoles.map((role) => role.roleId);

    render(withForm(roleIds));

    const options = stubRoles.map((role) => screen.queryByText(role.title));

    options.forEach((opt) => expect(opt).toBeInTheDocument());
  });

  it('correctly submits selected roles', async () => {
    render(withForm());

    const roleSelect = screen.getByLabelText('Access Roles');

    await selectEvent.select(roleSelect, ['Role #1', 'Role #2'], { container: document.body });

    const submitButton = screen.getByText('Submit');

    await waitFor(() => fireEvent.click(submitButton));

    expect(onSubmitMock).toHaveBeenCalledWith({
      roleIds: [1, 2],
    });
  });
});
