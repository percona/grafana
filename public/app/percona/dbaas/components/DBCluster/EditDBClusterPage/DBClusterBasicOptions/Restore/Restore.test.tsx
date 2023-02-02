import { screen, render, waitFor } from '@testing-library/react';
import React from 'react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';

import { configureStore } from '../../../../../../../store/configureStore';
import { StoreState } from '../../../../../../../types';
import { KubernetesClusterStatus } from '../../../../Kubernetes/KubernetesClusterStatus/KubernetesClusterStatus.types';
import { KubernetesOperatorStatus } from '../../../../Kubernetes/OperatorStatusItem/KubernetesOperatorStatus/KubernetesOperatorStatus.types';

import { Restore } from './Restore';

jest.mock('app/percona/dbaas/components/Kubernetes/Kubernetes.service');

describe('DBaaS DBCluster creation Restore section ::', () => {
  it('renders items correctly', async () => {
    await waitFor(() =>
      render(
        <Provider
          store={configureStore({
            percona: {
              user: { isAuthorized: true },
              settings: {
                loading: false,
                result: { isConnectedToPortal: true, alertingEnabled: true, dbaasEnabled: true },
              },
              kubernetes: {
                loading: false,
                result: [
                  {
                    kubernetesClusterName: 'cluster1',
                    status: KubernetesClusterStatus.ok,
                    operators: {
                      psmdb: { status: KubernetesOperatorStatus.ok, version: '1', availableVersion: '1' },
                      pxc: { status: KubernetesOperatorStatus.ok, version: '1', availableVersion: '1' },
                    },
                  },
                ],
              },
            },
          } as StoreState)}
        >
          <Form onSubmit={jest.fn()} render={({ form }) => <Restore form={form} />} />
        </Provider>
      )
    );
    expect(screen.getByTestId('toggle-scheduled-restore')).toBeInTheDocument();
    expect(screen.getByText('Enable restore')).toBeInTheDocument();
  });
});
