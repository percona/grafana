import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { ReactChild } from 'react';
import { Provider } from 'react-redux';

import { configureStore } from '../../../../../store/configureStore';
import { StoreState } from '../../../../../types';
import { DBClusterDetails, DBClusterStatus } from '../DBCluster.types';
import { dbClustersStub } from '../__mocks__/dbClustersStubs';

import { DBClusterActions } from './DBClusterActions';

jest.mock('app/core/app_events');
jest.mock('../XtraDB.service');

const setup = (child: ReactChild) =>
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
                expose: true,
              },
            } as DBClusterDetails,
          },
        },
      } as unknown as StoreState)}
    >
      {child}
    </Provider>
  );

describe('DBClusterActions::', () => {
  it('renders correctly', async () => {
    setup(
      <DBClusterActions
        dbCluster={dbClustersStub[0]}
        setSelectedCluster={jest.fn()}
        setDeleteModalVisible={jest.fn()}
        setEditModalVisible={jest.fn()}
        setLogsModalVisible={jest.fn()}
        setUpdateModalVisible={jest.fn()}
        getDBClusters={jest.fn()}
      />
    );

    expect(screen.getByTestId('dropdown-menu-toggle')).toBeInTheDocument();
  });

  it('doesnt disable button if cluster is ready', () => {
    setup(
      <DBClusterActions
        dbCluster={dbClustersStub[0]}
        setSelectedCluster={jest.fn()}
        setDeleteModalVisible={jest.fn()}
        setEditModalVisible={jest.fn()}
        setLogsModalVisible={jest.fn()}
        setUpdateModalVisible={jest.fn()}
        getDBClusters={jest.fn()}
      />
    );

    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('calls delete action correctly', async () => {
    const setSelectedCluster = jest.fn();
    const setDeleteModalVisible = jest.fn();
    setup(
      <DBClusterActions
        dbCluster={dbClustersStub[0]}
        setSelectedCluster={setSelectedCluster}
        setDeleteModalVisible={setDeleteModalVisible}
        setEditModalVisible={jest.fn()}
        setLogsModalVisible={jest.fn()}
        setUpdateModalVisible={jest.fn()}
        getDBClusters={jest.fn()}
      />
    );

    const btn = screen.getByRole('button');
    await waitFor(() => fireEvent.click(btn));

    const action = screen.getByTestId('dropdown-menu-menu').querySelectorAll('span')[1];
    await waitFor(() => fireEvent.click(action));

    expect(setSelectedCluster).toHaveBeenCalled();
    expect(setDeleteModalVisible).toHaveBeenCalled();
  });

  it('delete action is disabled if cluster is deleting', async () => {
    const setSelectedCluster = jest.fn();
    const setDeleteModalVisible = jest.fn();
    setup(
      <DBClusterActions
        dbCluster={dbClustersStub[3]}
        setSelectedCluster={setSelectedCluster}
        setDeleteModalVisible={setDeleteModalVisible}
        setEditModalVisible={jest.fn()}
        setLogsModalVisible={jest.fn()}
        setUpdateModalVisible={jest.fn()}
        getDBClusters={jest.fn()}
      />
    );

    const btn = screen.getByRole('button');
    await waitFor(() => fireEvent.click(btn));

    const action = screen.getByTestId('dropdown-menu-menu').querySelectorAll('span')[1];
    await waitFor(() => fireEvent.click(action));

    expect(setSelectedCluster).toHaveBeenCalled();
    expect(setDeleteModalVisible).toHaveBeenCalled();
  });

  it('calls restart action correctly', async () => {
    const getDBClusters = jest.fn();
    setup(
      <DBClusterActions
        dbCluster={dbClustersStub[0]}
        setSelectedCluster={jest.fn()}
        setDeleteModalVisible={jest.fn()}
        setEditModalVisible={jest.fn()}
        setLogsModalVisible={jest.fn()}
        setUpdateModalVisible={jest.fn()}
        getDBClusters={getDBClusters}
      />
    );

    const btn = screen.getByRole('button');
    await waitFor(() => fireEvent.click(btn));

    const action = screen.getByTestId('dropdown-menu-menu').querySelectorAll('span')[3];
    await waitFor(() => fireEvent.click(action));

    expect(getDBClusters).toHaveBeenCalled();
  });
});
