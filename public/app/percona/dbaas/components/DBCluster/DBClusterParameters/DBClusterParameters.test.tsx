import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from 'app/store/configureStore';

import { StoreState } from '../../../../../types';
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
            dbClusters: {
              loading: false,
              result: [
                {
                  clusterName: 'cluster_1',
                  kubernetesClusterName: 'cluster_1',
                  databaseType: 'mongodb',
                  clusterSize: 1,
                  memory: 1000,
                  cpu: 1000,
                  disk: 1000,
                  status: DBClusterStatus.unknown,
                  message: 'Error',
                },
              ],
            },
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
                  expose: true,
                },
              } as DBClusterDetails,
            },
          },
        } as unknown as StoreState)}
      >
        <DBClusterParameters dbCluster={dbClustersStub[0]} />
      </Provider>
    );

    await waitFor(() => screen.getByTestId('cluster-parameters-cluster-name'));

    const memory = screen.getByTestId('cluster-parameters-memory');
    const cpu = screen.getByTestId('cluster-parameters-cpu');
    const disk = screen.getByTestId('cluster-parameters-disk');
    const expose = screen.getByTestId('cluster-parameters-expose');

    expect(memory).toBeInTheDocument();
    expect(memory).toHaveTextContent('Memory:1000 GB');
    expect(cpu).toBeInTheDocument();
    expect(cpu).toHaveTextContent('CPU:1');
    expect(disk).toBeInTheDocument();
    expect(disk).toHaveTextContent('Disk:1000 GB');
    expect(expose).toBeInTheDocument();
    expect(expose).toHaveTextContent('External Access:Enabled');
  });

  it('renders parameters items correctly with MongoDB cluster', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            dbClusters: {
              loading: false,
              result: [
                {
                  clusterName: 'cluster_1',
                  kubernetesClusterName: 'cluster_1',
                  databaseType: 'mongodb',
                  clusterSize: 1,
                  memory: 1000,
                  cpu: 1000,
                  disk: 1000,
                  status: DBClusterStatus.unknown,
                  message: 'Error',
                },
              ],
            },
            dbClustersDetails: {
              loading: false,
              result: {
                cluster_3: {
                  clusterName: 'cluster_3',
                  kubernetesClusterName: 'cluster_1',
                  databaseType: 'mongodb',
                  clusterSize: 1,
                  memory: 1000,
                  cpu: 300,
                  disk: 15,
                  status: DBClusterStatus.ready,
                  message: 'Ready',
                },
              } as DBClusterDetails,
            },
          },
        } as unknown as StoreState)}
      >
        <DBClusterParameters dbCluster={dbClustersStub[2]} />
      </Provider>
    );

    await waitFor(() => screen.getByTestId('cluster-parameters-cluster-name'));

    const memory = screen.getByTestId('cluster-parameters-memory');
    const cpu = screen.getByTestId('cluster-parameters-cpu');
    const disk = screen.getByTestId('cluster-parameters-disk');
    const expose = screen.getByTestId('cluster-parameters-expose');

    expect(memory).toBeInTheDocument();
    expect(memory).toHaveTextContent('Memory:1000 GB');
    expect(cpu).toBeInTheDocument();
    expect(cpu).toHaveTextContent('CPU:300');
    expect(disk).toBeInTheDocument();
    expect(disk).toHaveTextContent('Disk:15 GB');
    expect(expose).toBeInTheDocument();
    expect(expose).toHaveTextContent('External Access:Disabled');
  });
});
