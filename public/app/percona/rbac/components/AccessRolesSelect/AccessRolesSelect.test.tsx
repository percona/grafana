import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';

import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import { stubRoles } from '../../__mocks__/stubs';

import AccessRolesSelect from './AccessRolesSelect';

const mockOnChange = jest.fn();

const withProvider = (roleIds: number[] = [], allowEmpty = false) => (
  <Provider
    store={configureStore({
      percona: {
        settings: {
          result: {
            enableAccessControl: true,
          },
        },
        roles: {
          isLoading: false,
          roles: stubRoles,
        },
      },
    } as StoreState)}
  >
    <AccessRolesSelect label="Access Roles" roleIds={roleIds} onChange={mockOnChange} allowEmpty={allowEmpty} />
  </Provider>
);

describe('AccessRolesSelect::', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('selects passed role', () => {
    render(withProvider([1]));

    const option = screen.queryByText(stubRoles[0].title);

    expect(option).toBeInTheDocument();
  });

  it('allows removal if there are multiple roles', () => {
    render(withProvider([1, 2]));

    const deleteButton = screen.queryByLabelText('Remove ' + stubRoles[0].title);

    expect(deleteButton).toBeInTheDocument();
  });

  it('prevents removal of last role by default', () => {
    render(withProvider([1]));

    const deleteButton = screen.queryByLabelText('Remove ' + stubRoles[0].title);

    expect(deleteButton).not.toBeInTheDocument();
  });

  it('allows removal of last role if allowEmpty is true', () => {
    render(withProvider([1], true));

    const deleteButton = screen.queryByLabelText('Remove ' + stubRoles[0].title);

    expect(deleteButton).toBeInTheDocument();
  });

  it('calls onChange when role is selected', async () => {
    render(withProvider([1]));

    const roleSelect = screen.getByLabelText('Access Roles');

    await selectEvent.select(roleSelect, ['Role #2'], { container: document.body });

    expect(mockOnChange).toHaveBeenCalledWith([1, 2]);
  });

  it('calls onChange when role is removed', () => {
    render(withProvider([1], true));

    const deleteButton = screen.getByLabelText('Remove ' + stubRoles[0].title);

    fireEvent.click(deleteButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });
});
