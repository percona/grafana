import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from '../../../../../store/configureStore';
import { StoreState } from '../../../../../types';
import { dbClustersStub } from '../__mocks__/dbClustersStubs';

import { DBClusterActions } from './DBClusterActions';

jest.mock('app/core/app_events');
jest.mock('../XtraDB.service');

describe('DBClusterActions::', () => {
  it('renders correctly', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: { result: { dbaasEnabled: true } },
          },
        } as StoreState)}
      >
        <DBClusterActions
          dbCluster={dbClustersStub[0]}
          setDeleteModalVisible={jest.fn()}
          setLogsModalVisible={jest.fn()}
          setUpdateModalVisible={jest.fn()}
          getDBClusters={jest.fn()}
        />
      </Provider>
    );

    expect(screen.getByTestId('dropdown-menu-toggle')).toBeInTheDocument();
  });

  it('doesnt disable button if cluster is ready', () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: { result: { dbaasEnabled: true } },
          },
        } as StoreState)}
      >
        <DBClusterActions
          dbCluster={dbClustersStub[0]}
          setDeleteModalVisible={jest.fn()}
          setLogsModalVisible={jest.fn()}
          setUpdateModalVisible={jest.fn()}
          getDBClusters={jest.fn()}
        />
      </Provider>
    );

    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('calls delete action correctly', async () => {
    const setDeleteModalVisible = jest.fn();
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: { result: { dbaasEnabled: true } },
          },
        } as StoreState)}
      >
        <DBClusterActions
          dbCluster={dbClustersStub[0]}
          setDeleteModalVisible={setDeleteModalVisible}
          setLogsModalVisible={jest.fn()}
          setUpdateModalVisible={jest.fn()}
          getDBClusters={jest.fn()}
        />
      </Provider>
    );

    const btn = screen.getByRole('button');
    await waitFor(() => fireEvent.click(btn));

    const action = screen.getByTestId('dropdown-menu-menu').querySelectorAll('span')[1];
    await waitFor(() => fireEvent.click(action));

    expect(setDeleteModalVisible).toHaveBeenCalled();
  });

  it('delete action is disabled if cluster is deleting', async () => {
    const setDeleteModalVisible = jest.fn();
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: { result: { dbaasEnabled: true } },
          },
        } as StoreState)}
      >
        <DBClusterActions
          dbCluster={dbClustersStub[3]}
          setDeleteModalVisible={setDeleteModalVisible}
          setLogsModalVisible={jest.fn()}
          setUpdateModalVisible={jest.fn()}
          getDBClusters={jest.fn()}
        />
      </Provider>
    );

    const btn = screen.getByRole('button');
    await waitFor(() => fireEvent.click(btn));

    const action = screen.getByTestId('dropdown-menu-menu').querySelectorAll('span')[1];
    await waitFor(() => fireEvent.click(action));

    expect(setDeleteModalVisible).toHaveBeenCalled();
  });

  xit('calls restart action correctly', async () => {
    const getDBClusters = jest.fn();
    render(
      <DBClusterActions
        dbCluster={dbClustersStub[0]}
        setDeleteModalVisible={jest.fn()}
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