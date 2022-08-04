import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { AddKubernetesModal } from './AddKubernetesModal';
import { Router } from 'react-router-dom';
import { locationService } from '@grafana/runtime';
import { Provider } from 'react-redux';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

describe('AddKubernetesModal::', () => {
  it('renders the modal with all the fields', () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: { loading: false, result: { publicAddress: 'localhost' } },
          },
        } as StoreState)}
      >
        <AddKubernetesModal isVisible addKubernetes={() => {}} setAddModalVisible={() => {}} />
      </Provider>
    );

    expect(screen.getByTestId('name-text-input')).toBeInTheDocument();
    expect(screen.getByTestId('kubeConfig-textarea-input')).toBeInTheDocument();
    expect(screen.getByTestId('isEKS-checkbox-input')).toBeInTheDocument();
    expect(screen.queryByTestId('pmm-server-url-warning')).toBeFalsy();
  });

  it('shows PMM Server Url Warning', async () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: { loading: false, result: { publicAddress: '' } },
          },
        } as StoreState)}
      >
        <Router history={locationService.getHistory()}>
          <AddKubernetesModal isVisible addKubernetes={() => {}} setAddModalVisible={() => {}} />
        </Router>
      </Provider>
    );
    expect(await screen.findByTestId('pmm-server-url-warning')).toBeInTheDocument();
  });

  it('calls addKubernetes with correct values on registering new cluster', () => {
    const addKubernetes = jest.fn();

    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: { loading: false, result: { publicAddress: 'localhost' } },
          },
        } as StoreState)}
      >
        <AddKubernetesModal isVisible addKubernetes={addKubernetes} setAddModalVisible={() => {}} />
      </Provider>
    );

    const name = 'Test name';
    const kubeConfig = 'Test config';
    const nameEvent = { target: { value: name } };
    const configEvent = { target: { value: kubeConfig } };
    const expected = {
      name,
      kubeConfig,
    };

    fireEvent.change(screen.getByTestId('name-text-input'), nameEvent);
    fireEvent.change(screen.getByTestId('kubeConfig-textarea-input'), configEvent);
    fireEvent.click(screen.getByTestId('kubernetes-add-cluster-button'));

    expect(addKubernetes).toHaveBeenCalledWith(expected, false);
  });

  it('clicking isEKS checkbox shows AWS credentials fields', () => {
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true },
            settings: { loading: false, result: { publicAddress: 'localhost' } },
          },
        } as StoreState)}
      >
        <AddKubernetesModal isVisible addKubernetes={() => {}} setAddModalVisible={() => {}} />
      </Provider>
    );

    expect(screen.queryByTestId('awsAccessKeyID-text-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('awsSecretAccessKey-password-input')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('isEKS-checkbox-input'));

    expect(screen.queryByTestId('awsAccessKeyID-text-input')).toBeInTheDocument();
    expect(screen.queryByTestId('awsSecretAccessKey-password-input')).toBeInTheDocument();
  });
});
