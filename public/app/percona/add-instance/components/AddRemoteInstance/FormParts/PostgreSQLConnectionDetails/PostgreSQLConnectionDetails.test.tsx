import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Form } from 'react-final-form';

import { PostgreSQLConnectionDetails } from './PostgreSQLConnectionDetails';

describe('PostgreSQL connection details:: ', () => {
  it('should have database attribute', () => {
    render(<Form onSubmit={jest.fn()} render={() => <PostgreSQLConnectionDetails remoteInstanceCredentials={{}} />} />);

    const textInput = screen.getByTestId('database-text-input');
    fireEvent.change(textInput, { target: { value: 'db1' } });

    expect(screen.getByTestId('database-text-input')).toHaveValue('db1');
  });

  it('should have max query length attribute', () => {
    render(<Form onSubmit={jest.fn()} render={() => <PostgreSQLConnectionDetails remoteInstanceCredentials={{}} />} />);

    const textInput = screen.getByTestId('maxQueryLength-text-input');
    fireEvent.change(textInput, { target: { value: '1000' } });

    expect(screen.getByTestId('maxQueryLength-text-input')).toHaveValue('1000');
  });

  it('should have max connection field for pg and rds pg', () => {
    render(
      <Form
        onSubmit={jest.fn()}
        render={() => <PostgreSQLConnectionDetails remoteInstanceCredentials={{ isAzure: false }} />}
      />
    );
    const connectionlimitInput = screen.queryByTestId('maxExporterConnections-text-input');
    expect(connectionlimitInput).toBeInTheDocument();
  });

  it('should not have max connection field for Azure', () => {
    render(
      <Form
        onSubmit={jest.fn()}
        render={() => <PostgreSQLConnectionDetails remoteInstanceCredentials={{ isAzure: true }} />}
      />
    );
    const connectionlimitInput = screen.queryByTestId('maxExporterConnections-text-input');
    expect(connectionlimitInput).not.toBeInTheDocument();
  });
});
