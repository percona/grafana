import { payloadToCamelCase } from 'app/percona/shared/helpers/payloadToCamelCase';
import {
  ContainerDbNode,
  DbNode,
  GenericDbNode,
  Node,
  NodeListPayload,
} from 'app/percona/shared/services/nodes/Nodes.types';

const MAIN_COLUMNS = ['node_id', 'node_name', 'address', 'custom_labels', 'type'];

export const toDbNodesModel = (nodeList: NodeListPayload): Node[] => {
  const result: Node[] = [];

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  (Object.keys(nodeList) as Array<keyof NodeListPayload>).forEach((nodeType) => {
    const nodeParams = nodeList[nodeType];

    nodeParams?.forEach((params) => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const camelCaseParams = <DbNode & GenericDbNode & ContainerDbNode>payloadToCamelCase(params);
      const extraLabels: Record<string, string> = {};

      Object.entries(params)
        .filter(([field]) => !MAIN_COLUMNS.includes(field))
        .forEach(([key, value]: [string, string]) => {
          extraLabels[key] = value;
        });

      if (!camelCaseParams.customLabels) {
        camelCaseParams.customLabels = {};
      }

      camelCaseParams.customLabels = { ...camelCaseParams.customLabels, ...extraLabels };

      result.push({
        type: nodeType,
        params: camelCaseParams,
      });
    });
  });

  return result;
};
