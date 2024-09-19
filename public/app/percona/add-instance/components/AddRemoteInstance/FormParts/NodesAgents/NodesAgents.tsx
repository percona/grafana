import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useStyles2 } from '@grafana/ui';
import { Messages } from 'app/percona/add-instance/components/AddRemoteInstance/FormParts/FormParts.messages';
import { getStyles } from 'app/percona/add-instance/components/AddRemoteInstance/FormParts/FormParts.styles';
import { agentId } from 'app/percona/add-instance/components/AddRemoteInstance/FormParts/NodesAgents/NodesAgents.constants';
import { NodesAgentsProps } from 'app/percona/add-instance/components/AddRemoteInstance/FormParts/NodesAgents/NodesAgents.types';
import { GET_NODES_CANCEL_TOKEN } from 'app/percona/inventory/Inventory.constants';
import { AgentsOption, NodesOption } from 'app/percona/inventory/Inventory.types';
import { SelectField } from 'app/percona/shared/components/Form/SelectFieldCore';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { nodesOptionsMapper } from 'app/percona/shared/core/reducers/nodes';
import { fetchNodesAction } from 'app/percona/shared/core/reducers/nodes/nodes';
import { getNodes } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { logger } from 'app/percona/shared/helpers/logger';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

export const NodesAgents: FC<NodesAgentsProps> = ({ form }) => {
  const styles = useStyles2(getStyles);
  const dispatch = useAppDispatch();
  const [generateToken] = useCancelToken();
  const [selectedNode, setSelectedNode] = useState<NodesOption>();
  const [selectedAgent, setSelectedAgent] = useState<AgentsOption>();
  const { nodes } = useSelector(getNodes);

  const nodesOptions = useMemo<NodesOption[]>(() => nodesOptionsMapper(nodes), [nodes]);

  const loadData = useCallback(async () => {
    try {
      await dispatch(fetchNodesAction({ token: generateToken(GET_NODES_CANCEL_TOKEN) })).unwrap();
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setNodeAndAgent = (value: NodesOption) => {
    setSelectedNode(value);

    if (value.agents && value.agents.length > 1) {
      const pmmServerAgent = value.agents.find((item) => item.value === agentId.pmmServer);
      if (pmmServerAgent) {
        form?.change('pmm_agent_id', pmmServerAgent);
      }
    } else if (value.agents && value.agents.length === 1) {
      form?.change('pmm_agent_id', value.agents[0]);
    }

    if (selectedAgent && selectedAgent.label !== agentId.pmmServer) {
      form?.change('address', 'localhost');
    }
  };

  useEffect(() => {
    if (nodesOptions.length === 0) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodesOptions]);

  return (
    <div className={styles.group}>
      <div className={styles.selectFieldWrapper}>
        <SelectField
          label={Messages.form.labels.nodesAgents.nodes}
          isSearchable={false}
          options={nodesOptions}
          name="node"
          id="nodes-selectbox"
          data-testid="nodes-selectbox"
          onChange={(event) => setNodeAndAgent(event as NodesOption)}
          className={styles.selectField}
          value={selectedNode}
          aria-label={Messages.form.labels.nodesAgents.nodes}
        />
      </div>
      <div className={styles.selectFieldWrapper}>
        <SelectField
          label={Messages.form.labels.nodesAgents.agents}
          isSearchable={false}
          disabled={!selectedNode || !selectedNode.agents || selectedNode.agents.length === 1}
          options={selectedNode?.agents || []}
          name="pmm_agent_id"
          data-testid="agents-selectbox"
          onChange={(event) => setSelectedAgent(event as AgentsOption)}
          className={styles.selectField}
          aria-label={Messages.form.labels.nodesAgents.agents}
        />
      </div>
    </div>
  );
};
