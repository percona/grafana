import { payloadToCamelCase } from 'app/percona/shared/helpers/payloadToCamelCase';

import { Agent, AgentType, ServiceAgent, ServiceAgentPayload } from '../Inventory.types';

const MAIN_COLUMNS = ['node_id', 'node_name', 'address', 'custom_labels', 'type'];

export const toAgentModel = (agentList: ServiceAgentPayload): Agent[] => {
  const result: Agent[] = [];

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  (Object.keys(agentList) as Array<keyof ServiceAgentPayload>).forEach((agentType) => {
    const agentParams = agentList[agentType];

    agentParams?.forEach((params) => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const camelCaseParams = <ServiceAgent>payloadToCamelCase(params);
      const extraLabels: Record<string, string> = {};

      Object.entries(params)
        .filter(([field]) => !MAIN_COLUMNS.includes(field))
        .forEach(([key, value]: [string, string]) => {
          if (typeof value !== 'object' || Array.isArray(value)) {
            extraLabels[key] = value;
          }
        });

      if (!camelCaseParams.customLabels) {
        camelCaseParams.customLabels = {};
      }

      if (params.username) {
        camelCaseParams.customLabels.password = '******';
      }

      camelCaseParams.customLabels = { ...camelCaseParams.customLabels, ...extraLabels };

      result.push({
        type: agentType,
        params: camelCaseParams,
      });
    });
  });

  return result;
};

export const beautifyAgentType = (type: AgentType): string =>
  type.replace(/^\w/, (c) => c.toUpperCase()).replace(/[_-]/g, ' ');
