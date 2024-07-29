import { FormApi } from "final-form";
import React, { FC, useCallback, useEffect, useState } from "react";

import { useStyles2 } from '@grafana/ui';
import { getStyles } from "app/percona/add-instance/components/AddRemoteInstance/FormParts/FormParts.styles";
import { GET_NODES_CANCEL_TOKEN } from "app/percona/inventory/Inventory.constants";
import { AgentsOptions, NodesOptions } from "app/percona/inventory/Inventory.types";
import { SelectField } from "app/percona/shared/components/Form/SelectFieldCore";
import { useCancelToken } from "app/percona/shared/components/hooks/cancelToken.hook";
import { fetchNodesOptionsAction } from "app/percona/shared/core/reducers/nodes/nodes";
import { isApiCancelError } from "app/percona/shared/helpers/api";
import { logger } from "app/percona/shared/helpers/logger";
import { useAppDispatch } from "app/store/store";

export interface NodesAgentsProps {
  form?: FormApi;
}

export const NodesAgents: FC<NodesAgentsProps> = ({ form }) => {
  const styles = useStyles2(getStyles);
  const dispatch = useAppDispatch();
  const [generateToken] = useCancelToken();
  const [selectedNode, setSelectedNode] = useState<NodesOptions| undefined>(undefined);
  const [selectedAgent, setSelectedAgent] = useState<AgentsOptions | undefined>(undefined);
  const [nodes, setNodes] = useState<NodesOptions[]>([]);

  const loadData = useCallback(async () => {
    try {
      setNodes(await dispatch(fetchNodesOptionsAction({ token: generateToken(GET_NODES_CANCEL_TOKEN) })).unwrap());
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setNodeAndAgent = (value: NodesOptions) => {
    setSelectedNode(value);
    if (value.agents && value.agents.length > 1) {
      form?.change('pmm_agent_id', value.agents[1]);
    } else if (value.agents && value.agents.length === 1) {
      form?.change('pmm_agent_id', value.agents[0]);
    }

    if(selectedAgent && selectedAgent.label !== "pmm-server") {
      form?.change('address', 'localhost');
    }
  }

  useEffect(() => {
    if(nodes.length === 0) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  return (
    <div className={styles.group}>
      <div className={styles.selectFieldWrapper}>
        <SelectField
          label="Nodes"
          isSearchable={false}
          disabled={false}
          options={nodes}
          name="node"
          data-testid="nodes-label"
          onChange={ (event) => { setNodeAndAgent(event as NodesOptions) }}
          className={styles.selectField}
          value={selectedNode}
        />
      </div>
      <div className={styles.selectFieldWrapper}>
        <SelectField
          label="Agents"
          isSearchable={false}
          disabled={!selectedNode || !selectedNode.agents || selectedNode.agents.length === 1}
          options={selectedNode?.agents || []}
          name="pmm_agent_id"
          data-testid="nodes-label"
          onChange={ (event) => { setSelectedAgent(event as AgentsOptions); }}
          className={styles.selectField}
        />
      </div>
    </div>
  );

}
