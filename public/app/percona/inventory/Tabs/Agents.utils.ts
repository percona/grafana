import { payloadToCamelCase } from 'app/percona/shared/helpers/payloadToCamelCase';

import { Agent, AgentType, ServiceAgentPayload } from '../Inventory.types';

const MAIN_COLUMNS = ['node_id', 'agent_id', 'node_name', 'address', 'custom_labels', 'type'];

export const toAgentModel = (agentList: ServiceAgentPayload): Agent[] => {
  const result: Agent[] = [];

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  (Object.keys(agentList) as Array<keyof ServiceAgentPayload>).forEach((agentType) => {
    const agentParams = agentList[agentType];

    agentParams?.forEach((params) => {
      const extraLabels: Record<string, string> = {};

      Object.entries(params)
        .filter(([field]) => !MAIN_COLUMNS.includes(field))
        .forEach(([key, value]: [string, string]) => {
          if (typeof value !== 'object' || Array.isArray(value)) {
            extraLabels[key] = value;

            if (key === 'username') {
              extraLabels.password = '******';
            }
            // @ts-ignore
            delete params[key];
          }
        });

      const camelCaseParams = payloadToCamelCase(params, ['custom_labels']);
      // @ts-ignore
      delete camelCaseParams['custom_labels'];

      result.push({
        type: agentType,
        // @ts-ignore
        params: {
          ...camelCaseParams,
          customLabels: { ...params['custom_labels'], ...extraLabels },
        },
      });
    });
  });

  return result;
};

export const beautifyAgentType = (type: AgentType): string =>
  type.replace(/^\w/, (c) => c.toUpperCase()).replace(/[_-]/g, ' ');
