import { BadgeColor } from '@grafana/ui';
import { payloadToCamelCase } from 'app/percona/shared/helpers/payloadToCamelCase';

import { Agent, AgentType, ServiceAgentPayload, ServiceAgentStatus } from '../Inventory.types';

const MAIN_COLUMNS = ['node_id', 'agent_id', 'node_name', 'address', 'custom_labels', 'type', 'status', 'is_connected'];

export const toAgentModel = (agentList: ServiceAgentPayload[]): Agent[] => {
  const result: Agent[] = [];

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  agentList.forEach(({ agent_type: agentType, status, is_connected, ...agentParams }) => {
    const extraLabels: Record<string, string> = {};
    let agentStatus = status || ServiceAgentStatus.UNKNOWN;

    if (is_connected !== undefined) {
      agentStatus = is_connected ? ServiceAgentStatus.RUNNING : ServiceAgentStatus.UNKNOWN;
    }

    Object.entries(agentParams)
      .filter(([field]) => !MAIN_COLUMNS.includes(field))
      .forEach(([key, value]: [string, string]) => {
        if (typeof value !== 'object' || Array.isArray(value)) {
          extraLabels[key] = value;

          if (key === 'username') {
            extraLabels.password = '******';
          }

          delete agentParams[key];
        }
      });

    const camelCaseParams = payloadToCamelCase(agentParams, ['custom_labels']);
    // @ts-ignore
    delete camelCaseParams['custom_labels'];

    result.push({
      type: agentType,
      // @ts-ignore
      params: {
        ...camelCaseParams,
        status: agentStatus,
        customLabels: { ...agentParams['custom_labels'], ...extraLabels },
      },
    });
  });

  return result;
};

export const beautifyAgentType = (type: AgentType): string =>
  type.replace(/^\w/, (c) => c.toUpperCase()).replace(/[_-]/g, ' ');

export const getAgentStatusColor = (status: ServiceAgentStatus): BadgeColor =>
  status === ServiceAgentStatus.STARTING || status === ServiceAgentStatus.RUNNING ? 'green' : 'red';
