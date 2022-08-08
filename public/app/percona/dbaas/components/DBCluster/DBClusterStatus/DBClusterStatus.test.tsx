import React from 'react';
import { DBCluster, DBClusterDetails, DBClusterStatus as Status } from '../DBCluster.types';
import { DBClusterStatus } from './DBClusterStatus';
import { dbClustersStub } from '../__mocks__/dbClustersStubs';
import { render, screen } from '@testing-library/react';
import { configureStore } from 'app/store/configureStore';
import { Provider } from 'react-redux';
import { StoreState } from 'app/types';

describe('DBClusterStatus::', () => {
  it('renders correctly when active', () => {
    const dbCluster: DBCluster = {
      ...dbClustersStub[0],
      message: 'Should not render error',
      finishedSteps: 10,
      totalSteps: 10,
    };
    const { container } = render(
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
                  status: Status.ready,
                  message: 'Ready',
                },
              } as DBClusterDetails,
            },
          },
        } as StoreState)}
      >
        <DBClusterStatus dbCluster={dbCluster} setSelectedCluster={jest.fn()} setLogsModalVisible={jest.fn()} />
      </Provider>
    );

    expect(screen.getByTestId('cluster-status-active')).toBeInTheDocument();
    expect(screen.queryByTestId('cluster-status-error-message')).not.toBeInTheDocument();
    expect(container.querySelector('span')?.className).toContain('active');
  });

  it('renders progress bar and error when changing', () => {
    const dbCluster: DBCluster = {
      ...dbClustersStub[0],
      message: 'Should render error',
      finishedSteps: 5,
      totalSteps: 10,
    };
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
                  status: Status.changing,
                  message: 'Ready',
                },
              } as DBClusterDetails,
            },
          },
        } as StoreState)}
      >
        <DBClusterStatus dbCluster={dbCluster} setSelectedCluster={jest.fn()} setLogsModalVisible={jest.fn()} />
      </Provider>
    );

    expect(screen.queryByTestId('cluster-status-active')).not.toBeInTheDocument();
    expect(screen.getByTestId('cluster-progress-bar')).toBeInTheDocument();
    expect(screen.getByTestId('cluster-status-error-message')).toBeInTheDocument();
  });

  it('renders error and progress bar when failed', () => {
    const dbCluster: DBCluster = {
      ...dbClustersStub[0],
      message: 'Should render error',
      finishedSteps: 10,
      totalSteps: 10,
    };
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
                  status: Status.failed,
                  message: 'Failed',
                },
              } as DBClusterDetails,
            },
          },
        } as StoreState)}
      >
        <DBClusterStatus dbCluster={dbCluster} setSelectedCluster={jest.fn()} setLogsModalVisible={jest.fn()} />
      </Provider>
    );

    expect(screen.queryByTestId('cluster-status-active')).not.toBeInTheDocument();
    expect(screen.getByTestId('cluster-progress-bar')).toBeInTheDocument();
    expect(screen.getByTestId('cluster-status-error-message')).toBeInTheDocument();
  });
});
