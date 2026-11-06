import { AgentsOption, AgentType, NodeDB, NodesOption } from 'app/percona/inventory/Inventory.types';

export const nodesOptionsMapper = (nodeFromDb: NodeDB[]): NodesOption[] =>
  nodeFromDb
    // Nodes belonging to a PMM deployment's own infrastructure (e.g. the HA persistence layer)
    // are dedicated and must not be delegated any monitoring workloads.
    .filter((node) => !node.is_pmm_internal_node)
    .map((node) => {
      const agents = (node.agents || [])
        .filter((agent) => agent.agent_type === AgentType.pmmAgent)
        .map<AgentsOption>((agent) => ({ value: agent.agent_id, label: agent.agent_id, key: agent.agent_type }));

      return {
        value: node.node_id,
        label: node.node_name,
        agents: agents,
        isPMMServerNode: node.is_pmm_server_node,
      };
    })
    .filter((node) => node.agents.length > 0);
