import React from 'react';
import { DBClusterConnection } from './DBClusterConnection';
import { dbClustersStub, mongoDBClusterConnectionStub } from '../__mocks__/dbClustersStubs';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';
import { DBClusterDetails, DBClusterStatus } from '../DBCluster.types';

jest.mock('app/core/app_events');
jest.mock('../XtraDB.service');
jest.mock('../PSMDB.service');

jest.mock('@percona/platform-core', () => {
  const originalModule = jest.requireActual('@percona/platform-core');
  return {
    ...originalModule,
    logger: {
      error: jest.fn(),
    },
  };
});

describe('DBClusterConnection::', () => {
  it('renders correctly connection items', async () => {
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
        <DBClusterConnection dbCluster={dbClustersStub[0]} />
      </Provider>
    );

    await waitFor(() => screen.getByTestId('cluster-connection-host'));
    expect(screen.getByTestId('cluster-connection-host')).toBeInTheDocument();
    expect(screen.getByTestId('cluster-connection-port')).toBeInTheDocument();
    expect(screen.getByTestId('cluster-connection-username')).toBeInTheDocument();
    expect(screen.getByTestId('cluster-connection-password')).toBeInTheDocument();
  });

  it('renders correctly connection items with MongoDB cluster', async () => {
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
        <DBClusterConnection dbCluster={dbClustersStub[2]} />
      </Provider>
    );

    await waitFor(() => screen.getByTestId('cluster-connection-host'));
    expect(screen.getByTestId('cluster-connection-host')).toBeInTheDocument();
    expect(screen.getByTestId('cluster-connection-host')).toHaveTextContent(mongoDBClusterConnectionStub.host);
    expect(screen.getByTestId('cluster-connection-port')).toBeInTheDocument();
    expect(screen.getByTestId('cluster-connection-username')).toBeInTheDocument();
    expect(screen.getByTestId('cluster-connection-password')).toBeInTheDocument();
  });
});
