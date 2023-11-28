import { __awaiter } from "tslib";
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from 'app/store/configureStore';
import { KubernetesClusterStatus } from './KubernetesClusterStatus/KubernetesClusterStatus.types';
import { KubernetesInventory } from './KubernetesInventory';
import { KubernetesOperatorStatus } from './OperatorStatusItem/KubernetesOperatorStatus/KubernetesOperatorStatus.types';
jest.mock('app/core/app_events');
jest.mock('app/percona/dbaas/components/Kubernetes/Kubernetes.service');
describe('KubernetesInventory::', () => {
    it('renders table correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        render(React.createElement(Provider, { store: configureStore({
                percona: {
                    user: { isAuthorized: true },
                    settings: { loading: false, result: { isConnectedToPortal: true, dbaasEnabled: true } },
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
                            {
                                kubernetesClusterName: 'cluster2',
                                status: KubernetesClusterStatus.ok,
                                operators: {
                                    psmdb: { status: KubernetesOperatorStatus.ok, version: '1', availableVersion: '1' },
                                    pxc: { status: KubernetesOperatorStatus.ok, version: '1', availableVersion: '1' },
                                },
                            },
                        ],
                    },
                    addKubernetes: { loading: false },
                    deleteKubernetes: { loading: false },
                },
            }) },
            React.createElement(KubernetesInventory, { setMode: jest.fn })));
        yield waitForElementToBeRemoved(() => screen.getByTestId('table-loading'));
        expect(screen.getAllByTestId('table-row')).toHaveLength(2);
    }));
});
//# sourceMappingURL=KubernetesInventory.test.js.map