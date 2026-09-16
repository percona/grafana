import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom-v5-compat';

import { configureStore } from 'app/store/configureStore';

import { InventoryService } from '../inventory/Inventory.service';
import { AgentType, ServiceAgentStatus } from '../inventory/Inventory.types';
import { stubWithLabels } from '../inventory/__mocks__/Inventory.service';
import { CustomLabelsUtils } from '../shared/helpers/customLabels';
import { logger } from '../shared/helpers/logger';
import { wrapWithGrafanaContextMock } from '../shared/helpers/testUtils';
import { ServicesService } from '../shared/services/services/Services.service';

import EditInstancePage from './EditInstance';

jest.mock('app/percona/inventory/Inventory.service');
jest.mock('app/percona/shared/services/services/Services.service');

const ROLE_ARN = 'arn:aws:iam::123456789012:role/PmmRdsMonitoring';
const ACCESS_KEY = 'AKIAIOSFODNN7EXAMPLE';

const rdsExporterAgent = {
  agent_id: 'rds_exporter_id',
  agent_type: AgentType.rdsExporter,
  status: ServiceAgentStatus.RUNNING,
  aws_access_key: ACCESS_KEY,
  is_aws_secret_key_set: true,
};

const mysqldExporterAgent = {
  agent_id: 'mysqld_exporter_id',
  agent_type: AgentType.mysqldExporter,
  status: ServiceAgentStatus.RUNNING,
};

const mockAgents = (...agents: object[]) => (InventoryService.getAgents as jest.Mock).mockResolvedValue({ agents });

const renderWithDefaults = () =>
  render(
    <MemoryRouter
      initialEntries={['/edit-instance/service_id']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route
          path="/edit-instance/:serviceId"
          element={<Provider store={configureStore()}>{wrapWithGrafanaContextMock(<EditInstancePage />)}</Provider>}
        />
      </Routes>
    </MemoryRouter>
  );

// The Save button lives in the app chrome, which is not rendered in isolation, so the form is
// submitted directly - the same path the keyboard takes. Saving then goes through a confirmation
// modal, so it takes a second click.
const save = async () => {
  fireEvent.submit(screen.getByTestId('edit-instance-form'));
  await waitFor(() => expect(screen.getByText('Confirm and save changes')).toBeInTheDocument());
  fireEvent.click(screen.getByText('Confirm and save changes'));
};

describe('EditInstance::', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (InventoryService.updateAgent as jest.Mock).mockResolvedValue({});
    mockAgents(mysqldExporterAgent);
  });

  it('prefills current values', async () => {
    renderWithDefaults();

    await waitFor(() => expect(screen.queryByLabelText('Environment')).toHaveValue(stubWithLabels.environment));
    await waitFor(() => expect(screen.queryByLabelText('Cluster')).toHaveValue(stubWithLabels.cluster));
    await waitFor(() => expect(screen.queryByLabelText('Replication set')).toHaveValue(stubWithLabels.replication_set));
    await waitFor(() =>
      expect(screen.queryByLabelText('Custom labels')).toHaveValue(
        CustomLabelsUtils.fromPayload(stubWithLabels.custom_labels)
      )
    );
  });

  it('leaves the credentials section out when the node has no RDS exporter', async () => {
    renderWithDefaults();

    await waitFor(() => expect(screen.queryByLabelText('Environment')).toHaveValue(stubWithLabels.environment));
    expect(screen.queryByTestId('rds-credentials')).not.toBeInTheDocument();
  });

  it('shows the credentials the RDS exporter currently uses', async () => {
    mockAgents(rdsExporterAgent, mysqldExporterAgent);
    renderWithDefaults();

    await waitFor(() => expect(screen.getByTestId('rds-credentials')).toBeInTheDocument());
    expect(screen.getByTestId('aws_access_key-text-input')).toHaveValue(ACCESS_KEY);
  });

  it('migrates to an IAM role by clearing both keys in one call', async () => {
    mockAgents(rdsExporterAgent, mysqldExporterAgent);
    renderWithDefaults();

    await waitFor(() => expect(screen.getByTestId('rds-credentials')).toBeInTheDocument());
    fireEvent.click(screen.getByText('IAM role'));
    fireEvent.change(screen.getByTestId('aws_role_arn-text-input'), { target: { value: ROLE_ARN } });
    await save();

    await waitFor(() =>
      expect(InventoryService.updateAgent).toHaveBeenCalledWith('rds_exporter_id', {
        rds_exporter: { aws_role_arn: ROLE_ARN, aws_access_key: '', aws_secret_key: '' },
      })
    );
  });

  it('does not touch the exporter when only labels change', async () => {
    mockAgents(rdsExporterAgent, mysqldExporterAgent);
    renderWithDefaults();

    await waitFor(() => expect(screen.getByTestId('rds-credentials')).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Environment'), { target: { value: 'staging' } });
    await save();

    await waitFor(() => expect(ServicesService.updateService).toHaveBeenCalled());
    expect(InventoryService.updateAgent).not.toHaveBeenCalled();
  });

  it('leaves the labels alone when the credentials change is rejected', async () => {
    // The rejected call is logged on purpose. The logger captures console.error at import time,
    // so it has to be silenced at the logger, not at the console.
    const loggerError = jest.spyOn(logger, 'error').mockImplementation();

    mockAgents(rdsExporterAgent, mysqldExporterAgent);
    (InventoryService.updateAgent as jest.Mock).mockRejectedValue(new Error('mutually exclusive'));
    renderWithDefaults();

    await waitFor(() => expect(screen.getByTestId('rds-credentials')).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Environment'), { target: { value: 'staging' } });
    fireEvent.click(screen.getByText('IAM role'));
    fireEvent.change(screen.getByTestId('aws_role_arn-text-input'), { target: { value: ROLE_ARN } });
    await save();

    await waitFor(() => expect(InventoryService.updateAgent).toHaveBeenCalled());
    expect(ServicesService.updateService).not.toHaveBeenCalled();
    loggerError.mockRestore();
  });
});
