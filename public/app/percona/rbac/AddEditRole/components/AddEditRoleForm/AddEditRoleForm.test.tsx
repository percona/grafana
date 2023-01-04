import { render, screen } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';

import { stubRoles, stubUsers, stubUsersMap } from 'app/percona/rbac/__mocks__/stubs';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import AddEditRoleForm from './AddEditRoleForm';
import { AddEditFormValues, AddEditRoleFormProps } from './AddEditRoleForm.types';

interface ProviderOptions {
  isAuthorized: boolean;
  enableAccessControl: boolean;
}

jest.mock('@grafana/runtime', () => {
  const runtime = jest.requireActual('@grafana/runtime');
  return {
    ...runtime,
    getDataSourceSrv: () => ({
      getInstanceSettings: () => undefined,
    }),
  };
});

const wrapWithProvider = (children: ReactElement, options: ProviderOptions) => (
  <Provider
    store={configureStore({
      percona: {
        user: {
          isAuthorized: options.isAuthorized,
        },
        settings: {
          result: {
            enableAccessControl: options.enableAccessControl,
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
    {children}
  </Provider>
);

const onCancelFc = jest.fn();
const onSubmitFc = jest.fn();
const initialValues: AddEditFormValues = {
  filter: '',
  title: '',
  description: '',
};

const renderWithDefaults = (options?: Partial<ProviderOptions>, props?: Partial<AddEditRoleFormProps>) =>
  render(
    wrapWithProvider(
      <AddEditRoleForm
        onCancel={onCancelFc}
        cancelLabel="Cancel"
        onSubmit={onSubmitFc}
        submitLabel="Submit"
        title="Title"
        initialValues={initialValues}
        {...props}
      />,
      {
        enableAccessControl: true,
        isAuthorized: true,
        ...options,
      }
    )
  );

describe('AddEditRoleForm', () => {
  beforeEach(() => {
    onCancelFc.mockClear();
    onSubmitFc.mockClear();
  });

  it("shows warning if user isn't an admin", () => {
    renderWithDefaults({ isAuthorized: false });
    expect(screen.getByText('Insufficient access permissions.')).toBeInTheDocument();
  });

  it("shows warning if access roles aren't enabled", () => {
    renderWithDefaults({ enableAccessControl: false });
    expect(screen.getByText('Feature is disabled.')).toBeInTheDocument();
  });

  it('calls cancel', () => {
    renderWithDefaults();
    const cancelButton = screen.getByTestId('add-edit-role-cancel');
    cancelButton.click();
    expect(onCancelFc).toHaveBeenCalled();
  });

  // TODO fix
  xit('role name is required', () => {
    renderWithDefaults();
    const submitButton = screen.getByTestId('add-edit-role-submit');
    submitButton.click();

    expect(screen.getByText('Role name is required')).toBeInTheDocument();
  });
});
