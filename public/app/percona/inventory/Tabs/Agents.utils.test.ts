import { Agent, AgentType, ServiceAgentPayload, ServiceAgentStatus } from '../Inventory.types';

import { toAgentModel } from './Agents.utils';

describe('toAgentModel', () => {
  it('should correctly convert payload', () => {
    const payload: ServiceAgentPayload = {
      amazon_rds_mysql: [
        {
          agent_id: 'agent1',
          status: ServiceAgentStatus.RUNNING,
          username: 'john',
        },
      ],
      mongodb: [
        {
          agent_id: 'agent2',
          status: ServiceAgentStatus.STOPPING,
          listen_port: '3000',
          pmm_agent_id: 'pmm-server',
          custom_labels: {
            aditional_prop: 'prop_value',
          },
        },
      ],
    };

    expect(toAgentModel(payload)).toEqual<Agent[]>([
      {
        type: AgentType.amazonRdsMysql,
        params: {
          agentId: 'agent1',
          customLabels: {
            username: 'john',
            password: '******',
            status: ServiceAgentStatus.RUNNING,
          },
        },
      },
      {
        type: AgentType.mongodb,
        params: {
          agentId: 'agent2',
          customLabels: {
            status: ServiceAgentStatus.STOPPING,
            listen_port: '3000',
            pmm_agent_id: 'pmm-server',
            aditional_prop: 'prop_value',
          },
        },
      },
    ]);
  });
});
