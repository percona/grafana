import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import { DBClusterDetails, DBClusterStatus } from '../DBCluster.types';
import { dbClustersStub } from '../__mocks__/dbClustersStubs';

import { DBClusterParameters } from './DBClusterParameters';

jest.mock('app/core/app_events');
jest.mock('../XtraDB.service');
jest.mock('../PSMDB.service');

describe('DBClusterParameters::', () => {
  it('renders parameters items correctly', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            dbClustersDetails: {
              loading: false,
              result: {
                cluster_1: {
                  clusterName: 'cluster_1',
                  kubernetesClusterName: 'cluster_1',
                  databaseType: 'mongodb',
                  clusterSize: 1,
                  memory: 1000,
                  cpu: 1000,
                  disk: 1000,
                  status: DBClusterStatus.ready,
                  message: 'Ready',
                },
              } as DBClusterDetails,
            },
          },
        } as StoreState)}
      >
        <DBClusterParameters dbCluster={dbClustersStub[0]} />
      </Provider>
    );

    expect(screen.getByTestId('cluster-parameters-cluster-name')).toBeInTheDocument();

    const memory = screen.getByTestId('cluster-parameters-memory');
    const cpu = screen.getByTestId('cluster-parameters-cpu');
    const disk = screen.getByTestId('cluster-parameters-disk');
    const expose = screen.getByTestId('cluster-parameters-expose');

    expect(memory).toBeInTheDocument();
    expect(memory).toHaveTextContent('Memory:1024 GB');
    expect(cpu).toBeInTheDocument();
    expect(cpu).toHaveTextContent('CPU:1');
    expect(disk).toBeInTheDocument();
    expect(disk).toHaveTextContent('Disk:25 GB');
    expect(expose).toBeInTheDocument();
    expect(expose).toHaveTextContent('External Access:Enabled');
  });

  it('renders parameters items correctly with MongoDB cluster', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            dbClustersDetails: {
              loading: false,
              result: {
                cluster_3: {
                  clusterName: 'cluster_3',
                  kubernetesClusterName: 'cluster_1',
                  databaseType: 'mongodb',
                  clusterSize: 1,
                  memory: 1000,
                  cpu: 1000,
                  disk: 1000,
                  status: DBClusterStatus.ready,
                  message: 'Ready',
                },
              } as DBClusterDetails,
            },
          },
        } as StoreState)}
      >
        <DBClusterParameters dbCluster={dbClustersStub[2]} />
      </Provider>
    );

    expect(screen.getByTestId('cluster-parameters-cluster-name')).toBeInTheDocument();

    const memory = screen.getByTestId('cluster-parameters-memory');
    const cpu = screen.getByTestId('cluster-parameters-cpu');
    const disk = screen.getByTestId('cluster-parameters-disk');
    const expose = screen.getByTestId('cluster-parameters-expose');

    expect(memory).toBeInTheDocument();
    expect(memory).toHaveTextContent('Memory:0 GB');
    expect(cpu).toBeInTheDocument();
    expect(cpu).toHaveTextContent('CPU:0');
    expect(disk).toBeInTheDocument();
    expect(disk).toHaveTextContent('Disk:25 GB');
    expect(expose).toBeInTheDocument();
    expect(expose).toHaveTextContent('External Access:Disabled');
  });
});
