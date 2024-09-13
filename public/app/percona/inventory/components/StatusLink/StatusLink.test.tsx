import { render, screen } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';

import { locationService } from '@grafana/runtime';
import { DbAgent } from 'app/percona/shared/services/services/Services.types';

import { AgentType, ServiceAgentStatus } from '../../Inventory.types';
import { getAgentsMonitoringStatus } from '../../Tabs/Services.utils';

import { StatusLink } from './StatusLink';

describe('StatusLink', () => {
  it('should show "OK" if agents are running, starting or connected', () => {
    const agents: DbAgent[] = [
      {
        agentId: 'agent1',
        status: ServiceAgentStatus.RUNNING,
      },
      {
        agentId: 'agent2',
        status: ServiceAgentStatus.STARTING,
      },
      {
        agentId: 'agent3',
        isConnected: true,
      },
    ];

    const agentsStatus = getAgentsMonitoringStatus(agents);
    render(
      <Router history={locationService.getHistory()}>
        <StatusLink agentsStatus={agentsStatus} type="services" strippedId="service_id_1" />
      </Router>
    );
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.queryByText('Failed')).not.toBeInTheDocument();
  });

  it('should show "Failed" if some agent is not connected', () => {
    const agents: DbAgent[] = [
      {
        agentId: 'agent1',
        status: ServiceAgentStatus.RUNNING,
      },
      {
        agentId: 'agent2',
        status: ServiceAgentStatus.STARTING,
      },
      {
        agentId: 'agent3',
        agentType: AgentType.pmmAgent,
        isConnected: false,
      },
    ];
    const agentsStatus = getAgentsMonitoringStatus(agents);
    render(
      <Router history={locationService.getHistory()}>
        <StatusLink agentsStatus={agentsStatus} type="services" strippedId="service_id_1" />
      </Router>
    );
    expect(screen.queryByText('OK')).not.toBeInTheDocument();
    expect(screen.queryByText('N/A')).not.toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('should show "N/A" if some agent is not connected and is an external exporter', () => {
    const agents: DbAgent[] = [
      {
        agentId: 'agent1',
        status: ServiceAgentStatus.RUNNING,
      },
      {
        agentId: 'agent2',
        status: ServiceAgentStatus.STARTING,
      },
      {
        agentId: 'agent3',
        agentType: AgentType.externalExporter,
        isConnected: false,
      },
    ];
    const agentsStatus = getAgentsMonitoringStatus(agents);
    render(
      <Router history={locationService.getHistory()}>
        <StatusLink agentsStatus={agentsStatus} type="services" strippedId="service_id_1" />
      </Router>
    );
    expect(screen.queryByText('OK')).not.toBeInTheDocument();
    expect(screen.queryByText('Failed')).not.toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should show "Failed" if some agent is not starting or running', () => {
    const agents: DbAgent[] = [
      {
        agentId: 'agent1',
        status: ServiceAgentStatus.RUNNING,
      },
      {
        agentId: 'agent2',
        status: ServiceAgentStatus.STOPPING,
      },
    ];
    const agentsStatus = getAgentsMonitoringStatus(agents);
    render(
      <Router history={locationService.getHistory()}>
        <StatusLink agentsStatus={agentsStatus} type="services" strippedId="service_id_1" />
      </Router>
    );
    expect(screen.queryByText('OK')).not.toBeInTheDocument();
    expect(screen.queryByText('N/A')).not.toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('should show "N/A" if there are unknown agents', () => {
    const agents: DbAgent[] = [
      {
        agentId: 'agent1',
        status: ServiceAgentStatus.RUNNING,
      },
      {
        agentId: 'agent2',
        status: ServiceAgentStatus.UNKNOWN,
      },
    ];
    const agentsStatus = getAgentsMonitoringStatus(agents);
    render(
      <Router history={locationService.getHistory()}>
        <StatusLink agentsStatus={agentsStatus} type="services" strippedId="service_id_1" />
      </Router>
    );
    expect(screen.queryByText('OK')).not.toBeInTheDocument();
    expect(screen.queryByText('Failed')).not.toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should show "N/A" if there are invalid agents', () => {
    const agents: DbAgent[] = [
      {
        agentId: 'agent1',
        status: ServiceAgentStatus.RUNNING,
      },
      {
        agentId: 'agent2',
        status: ServiceAgentStatus.INVALID,
      },
    ];
    const agentsStatus = getAgentsMonitoringStatus(agents);
    render(
      <Router history={locationService.getHistory()}>
        <StatusLink agentsStatus={agentsStatus} type="services" strippedId="service_id_1" />
      </Router>
    );
    expect(screen.queryByText('OK')).not.toBeInTheDocument();
    expect(screen.queryByText('Failed')).not.toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
