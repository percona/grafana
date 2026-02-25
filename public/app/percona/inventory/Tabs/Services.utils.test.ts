import { v4 as uuidv4 } from 'uuid';

import { DbAgent } from 'app/percona/shared/services/services/Services.types';

import { AgentType, MonitoringStatus, ServiceAgentStatus } from '../Inventory.types';

import { getAgentsMonitoringStatus } from './Services.utils';

describe('getAgentsMonitoringStatus', () => {
  it('return OK if all agents are ok', () => {
    const agents: DbAgent[] = [
      { agentId: uuidv4(), agentType: AgentType.mysqldExporter, status: ServiceAgentStatus.RUNNING },
      { agentId: uuidv4(), agentType: AgentType.nodeExporter, status: ServiceAgentStatus.RUNNING },
    ];
    expect(getAgentsMonitoringStatus(agents)).toBe(MonitoringStatus.OK);
  });

  it('returns OK if only disabled agent is pg stat statements', () => {
    const agents: DbAgent[] = [
      { agentId: uuidv4(), agentType: AgentType.postgresExporter, status: ServiceAgentStatus.RUNNING },
      {
        agentId: uuidv4(),
        agentType: AgentType.qanPostgresql_pgstatements_agent,
        disabled: true,
        status: ServiceAgentStatus.DONE,
      },
    ];
    expect(getAgentsMonitoringStatus(agents)).toBe(MonitoringStatus.OK);
  });

  it('returns Warning if there are multiple disabled agents in Done status', () => {
    const agents: DbAgent[] = [
      { agentId: uuidv4(), agentType: AgentType.mysqldExporter, status: ServiceAgentStatus.RUNNING },
      {
        agentId: uuidv4(),
        agentType: AgentType.qanMysql_perfschema_agent,
        disabled: true,
        status: ServiceAgentStatus.DONE,
      },
      {
        agentId: uuidv4(),
        agentType: AgentType.qanMysql_slowlog_agent,
        disabled: true,
        status: ServiceAgentStatus.DONE,
      },
    ];
    expect(getAgentsMonitoringStatus(agents)).toBe(MonitoringStatus.WARNING);
  });

  it('returns Warning if there are multiple disabled agents in Done status', () => {
    const agents: DbAgent[] = [
      { agentId: uuidv4(), agentType: AgentType.mysqldExporter, status: ServiceAgentStatus.RUNNING },
      {
        agentId: uuidv4(),
        agentType: AgentType.qanMysql_slowlog_agent,
        disabled: true,
        status: ServiceAgentStatus.DONE,
      },
      {
        agentId: uuidv4(),
        agentType: AgentType.qanPostgresql_pgstatements_agent,
        disabled: true,
        status: ServiceAgentStatus.DONE,
      },
    ];
    expect(getAgentsMonitoringStatus(agents)).toBe(MonitoringStatus.WARNING);
  });

  it('returns Failed if there are failing agents', () => {
    const agents: DbAgent[] = [
      { agentId: uuidv4(), agentType: AgentType.mysqldExporter, status: ServiceAgentStatus.RUNNING },
      { agentId: uuidv4(), agentType: AgentType.nodeExporter, status: ServiceAgentStatus.WAITING },
    ];
    expect(getAgentsMonitoringStatus(agents)).toBe(MonitoringStatus.FAILED);
  });

  it('returns OK if there is only one RTA agent disabled agent in Done status', () => {
    const agents: DbAgent[] = [
      { agentId: uuidv4(), agentType: AgentType.rtaMongoDBAgent, status: ServiceAgentStatus.DONE, disabled: true },
    ];
    expect(getAgentsMonitoringStatus(agents)).toBe(MonitoringStatus.OK);
  });

  it('returns status regardless of RTA agent status if that agent is disabled', () => {
    const agents: DbAgent[] = [
      { agentId: uuidv4(), agentType: AgentType.rtaMongoDBAgent, status: ServiceAgentStatus.RUNNING, disabled: true },
    ];
    expect(getAgentsMonitoringStatus(agents)).toBe(MonitoringStatus.OK);
  });

  it('returns OK of only agent is disabled and of type qanPostgresql_pgstatements_agent', () => {
    const agents: DbAgent[] = [
      {
        agentId: uuidv4(),
        agentType: AgentType.qanPostgresql_pgstatements_agent,
        status: ServiceAgentStatus.RUNNING,
        disabled: true,
      },
    ];
    expect(getAgentsMonitoringStatus(agents)).toBe(MonitoringStatus.OK);
  });

  it('returns Warning if only agent is disabled and not of type qanPostgresql_pgstatements_agent', () => {
    const agents: DbAgent[] = [
      {
        agentId: uuidv4(),
        agentType: AgentType.nodeExporter,
        status: ServiceAgentStatus.RUNNING,
        disabled: true,
      },
    ];

    expect(getAgentsMonitoringStatus(agents)).toBe(MonitoringStatus.WARNING);
  });
});
