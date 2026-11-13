import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormApi } from 'final-form';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';

import { configureStore } from 'app/store/configureStore';

import { MySQLConnectionDetails } from '../MySQLConnectionDetails/MySQLConnectionDetails';

import { requiredUnlessVaultPath, validateVaultPath, VaultPathField } from './VaultPath';

jest.mock('app/percona/inventory/Inventory.service');

describe('VaultPath::', () => {
  it('accepts the paths PMM Server accepts', () => {
    expect(validateVaultPath('')).toBeUndefined();
    expect(validateVaultPath('secret/data/pmm/mysql')).toBeUndefined();
    expect(validateVaultPath('/secret/data/pmm/mysql/')).toBeUndefined();
  });

  it('refuses the paths PMM Server refuses', () => {
    [
      'secret/data/pmm mysql',
      'secret/data/pmm?x=1',
      'secret/data/pmm#key',
      'secret//pmm',
      'secret/../pmm',
      '/',
    ].forEach((path) => expect(validateVaultPath(path)).toBeDefined());
  });

  it('makes a credential optional when the service reads it from Vault', () => {
    expect(requiredUnlessVaultPath('', {})).toBeDefined();
    expect(requiredUnlessVaultPath('', { vault_path: 'secret/data/pmm/mysql' })).toBeUndefined();
    expect(requiredUnlessVaultPath('s3cr3t', {})).toBeUndefined();
  });

  it('renders the Vault path field', () => {
    render(<Form onSubmit={jest.fn()} render={() => <VaultPathField />} />);

    expect(screen.getByTestId('vault_path-text-input')).toBeInTheDocument();
  });

  it('makes the username and password optional once a Vault path is given', async () => {
    let formApi: FormApi | undefined;
    render(
      <Provider store={configureStore()}>
        <Form
          onSubmit={jest.fn()}
          render={({ form }) => {
            formApi = form;
            return <MySQLConnectionDetails form={form} remoteInstanceCredentials={{}} />;
          }}
        />
      </Provider>
    );

    await waitFor(() => expect(formApi?.getState().errors?.password).toBeDefined());
    expect(formApi?.getState().errors?.username).toBeDefined();

    fireEvent.change(screen.getByTestId('vault_path-text-input'), { target: { value: 'secret/data/pmm/mysql' } });

    await waitFor(() => expect(formApi?.getState().errors?.password).toBeUndefined());
    expect(formApi?.getState().errors?.username).toBeUndefined();
    expect(formApi?.getState().values.vault_path).toEqual('secret/data/pmm/mysql');
  });
});
