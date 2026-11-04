import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import { InventoryService } from 'app/percona/inventory/Inventory.service';
import { NodeDB } from 'app/percona/inventory/Inventory.types';
import { wrapWithGrafanaContextMock } from 'app/percona/shared/helpers/testUtils';
import { HighAvailabilityService } from 'app/percona/shared/services/highAvailability/HighAvailability.service';
import { ServiceStatus } from 'app/percona/shared/services/services/Services.types';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types/store';

import { Messages } from '../Inventory.messages';

import { NodesTab } from './Nodes';

jest.mock('app/percona/inventory/Inventory.service');
jest.mock('app/percona/shared/core/hooks/recurringCall.hook');

const nodeDB = (nodeId: string, overrides: Partial<NodeDB> = {}): NodeDB => ({
  node_id: nodeId,
  node_type: 'generic',
  node_name: nodeId,
  address: '10.1.2.3',
  created_at: '2026-10-28T08:05:31.079300Z',
  updated_at: '2026-10-28T08:05:31.079300Z',
  status: ServiceStatus.UP,
  is_pmm_server_node: false,
  ...overrides,
});

const renderNodesTab = async () => {
  render(
    <Provider
      store={configureStore({
        percona: {
          user: { isAuthorized: true },
          settings: { result: {} },
        },
      } as StoreState)}
    >
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {wrapWithGrafanaContextMock(<NodesTab />)}
      </MemoryRouter>
    </Provider>
  );

  await screen.findByText('regular-node');
};

const getRow = (nodeName: string) => screen.getByText(nodeName).closest('tr')!;

const openActions = (row: HTMLElement) => userEvent.click(within(row).getByRole('button', { name: 'Toggle' }));

describe('NodesTab', () => {
  beforeEach(() => {
    jest.spyOn(HighAvailabilityService, 'getNodes').mockResolvedValue({ nodes: [] });
    jest.spyOn(InventoryService, 'getNodes').mockResolvedValue({
      nodes: [
        nodeDB('regular-node'),
        nodeDB('pmm-server', { is_pmm_server_node: true }),
        nodeDB('pmm-pmm-ha-client-0', { is_pmm_protected_node: true }),
      ],
    });
  });

  it('offers a regular node for removal', async () => {
    await renderNodesTab();
    const row = getRow('regular-node');

    expect(within(row).getByTestId('table-select-regular-node-checkbox-input')).toBeEnabled();
    await openActions(row);
    expect(within(row).getByText(Messages.overrideThresholds)).toBeInTheDocument();
    expect(within(row).getByText(Messages.delete)).toBeInTheDocument();
  });

  it.each(['pmm-server', 'pmm-pmm-ha-client-0'])(
    'keeps only Override thresholds for non-removable node %s',
    async (nodeName) => {
      await renderNodesTab();
      const row = getRow(nodeName);

      expect(within(row).getByTestId(`table-select-${nodeName}-checkbox-input`)).toBeDisabled();
      await openActions(row);
      expect(within(row).getByText(Messages.overrideThresholds)).toBeInTheDocument();
      expect(within(row).queryByText(Messages.delete)).not.toBeInTheDocument();
    }
  );
});
