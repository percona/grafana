import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { Form, FormRenderProps } from 'react-final-form';

import { Databases } from 'app/percona/shared/core';

import { dbClustersStub } from '../../__mocks__/dbClustersStubs';
import { BasicOptionsFields } from '../DBClusterBasicOptions/DBClusterBasicOptions.types';

import { DBClusterAdvancedOptions } from './DBClusterAdvancedOptions';
import { AdvancedOptionsFields, DBClusterResources } from './DBClusterAdvancedOptions.types';

jest.mock('../../DBCluster.service');
jest.mock('../../PSMDB.service');
jest.mock('../../XtraDB.service');

jest.mock('@percona/platform-core', () => {
  const originalModule = jest.requireActual('@percona/platform-core');
  return {
    ...originalModule,
    logger: {
      error: jest.fn(),
    },
  };
});

describe('DBClusterAdvancedOptions::', () => {
  xit('renders correctly in create mode', async () => {
    act(() => {
      render(
        <Form
          onSubmit={jest.fn()}
          render={({ form, handleSubmit, valid, pristine, ...props }) => (
            <DBClusterAdvancedOptions
              mode={'create'}
              showUnsafeConfigurationWarning={true}
              setShowUnsafeConfigurationWarning={jest.fn()}
              form={form}
              selectedCluster={dbClustersStub[0]}
              handleSubmit={handleSubmit}
              pristine={pristine}
              valid={valid}
              {...props}
            />
          )}
        />
      );
    });

    const radioState = await screen.findByTestId('topology-radio-state');

    expect(radioState).toBeInTheDocument();
    expect(await screen.queryByTestId('nodes-number-input')).toBeInTheDocument();
    expect(await screen.getAllByTestId('resources-radio-button').length).toBeGreaterThan(0);
    expect(await screen.queryByTestId('memory-number-input')).toBeInTheDocument();
    expect(await screen.queryByTestId('cpu-number-input')).toBeInTheDocument();
    expect(await screen.queryByTestId('disk-number-input')).toBeInTheDocument();
  });

  xit('renders correctly in edit mode', async () => {
    act(() => {
      render(
        <Form
          onSubmit={jest.fn()}
          render={(renderProps) => (
            <DBClusterAdvancedOptions
              mode={'create'}
              showUnsafeConfigurationWarning={false}
              setShowUnsafeConfigurationWarning={jest.fn()}
              {...renderProps}
            />
          )}
        />
      );
    });

    const radioState = await screen.findByTestId('topology-radio-state');

    expect(radioState).toBeInTheDocument();

    expect(screen.getByTestId('nodes-number-input')).toBeInTheDocument();
    expect(screen.getAllByTestId('resources-radio-button').length).toBeGreaterThan(0);
    expect(screen.getByTestId('memory-number-input')).toBeInTheDocument();
    expect(screen.getByTestId('cpu-number-input')).toBeInTheDocument();
    expect(screen.getByTestId('disk-number-input')).toBeInTheDocument();
    expect(screen.getByTestId('dbcluster-resources-bar-memory')).toBeInTheDocument();
    expect(screen.getByTestId('dbcluster-resources-bar-cpu')).toBeInTheDocument();
    expect(screen.getByTestId('disk-number-input')).toBeInTheDocument();
  });

  xit('renders correctly with initial values', async () => {
    act(() => {
      render(
        <Form
          initialValues={{
            [AdvancedOptionsFields.nodes]: 3,
          }}
          onSubmit={jest.fn()}
          render={(renderProps: FormRenderProps) => (
            <DBClusterAdvancedOptions
              mode={'create'}
              showUnsafeConfigurationWarning={false}
              setShowUnsafeConfigurationWarning={jest.fn()}
              {...renderProps}
            />
          )}
        />
      );
    });

    const nodes = await screen.findByTestId('nodes-number-input');

    expect(nodes.getAttribute('value')).toBe('3');
  });

  xit('should disable memory, cpu and disk when resources are not custom', async () => {
    act(() => {
      render(
        <Form
          initialValues={{
            [AdvancedOptionsFields.resources]: DBClusterResources.small,
          }}
          onSubmit={jest.fn()}
          render={(renderProps: FormRenderProps) => (
            <DBClusterAdvancedOptions
              mode={'create'}
              showUnsafeConfigurationWarning={false}
              setShowUnsafeConfigurationWarning={jest.fn()}
              {...renderProps}
            />
          )}
        />
      );
    });
    const memory = await screen.findByTestId('memory-number-input');
    const cpu = screen.getByTestId('cpu-number-input');
    const disk = screen.getByTestId('disk-number-input');

    expect(memory).toBeDisabled();
    expect(cpu).toBeDisabled();
    expect(disk).toBeDisabled();
  });

  xit('should enable memory and cpu when resources is custom', async () => {
    act(() => {
      render(
        <Form
          initialValues={{
            [AdvancedOptionsFields.resources]: DBClusterResources.small,
          }}
          onSubmit={jest.fn()}
          render={(renderProps: FormRenderProps) => (
            <DBClusterAdvancedOptions
              mode={'create'}
              showUnsafeConfigurationWarning={false}
              setShowUnsafeConfigurationWarning={jest.fn()}
              {...renderProps}
            />
          )}
        />
      );
    });

    const resources = await screen.findByTestId('resources-radio-state');
    fireEvent.change(resources, { target: { value: DBClusterResources.custom } });

    const memory = screen.getByTestId('memory-number-input');
    const cpu = screen.getByTestId('cpu-number-input');
    const disk = screen.getByTestId('disk-number-input');

    expect(memory).not.toBeDisabled();
    expect(cpu).not.toBeDisabled();
    expect(disk).not.toBeDisabled();
  });

  xit('should enable single node topology when database is MongoDB', async () => {
    act(() => {
      render(
        <Form
          initialValues={{
            [BasicOptionsFields.databaseType]: {
              value: Databases.mongodb,
              key: Databases.mongodb,
            },
          }}
          onSubmit={jest.fn()}
          render={(renderProps: FormRenderProps) => (
            <DBClusterAdvancedOptions
              mode={'create'}
              showUnsafeConfigurationWarning={false}
              setShowUnsafeConfigurationWarning={jest.fn()}
              {...renderProps}
            />
          )}
        />
      );
    });

    const topology = await screen.findAllByTestId('topology-radio-button');

    expect(topology[1]).not.toBeDisabled();
  });

  xit('should enable single node topology when database is MySQL', async () => {
    act(() => {
      render(
        <Form
          initialValues={{
            [BasicOptionsFields.databaseType]: {
              value: Databases.mysql,
              key: Databases.mysql,
            },
          }}
          onSubmit={jest.fn()}
          render={(renderProps: FormRenderProps) => (
            <DBClusterAdvancedOptions
              mode={'create'}
              showUnsafeConfigurationWarning={false}
              setShowUnsafeConfigurationWarning={jest.fn()}
              {...renderProps}
            />
          )}
        />
      );
    });
    const topology = await screen.findAllByTestId('topology-radio-button');

    expect(topology[1]).not.toBeDisabled();
  });
});
