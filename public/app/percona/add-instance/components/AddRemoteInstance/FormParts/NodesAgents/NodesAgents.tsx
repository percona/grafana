import { FC, useCallback, useEffect, useMemo } from 'react';
import { useField } from 'react-final-form';

import { useStyles2 } from '@grafana/ui';
import { Messages } from 'app/percona/add-instance/components/AddRemoteInstance/FormParts/FormParts.messages';
import { getStyles } from 'app/percona/add-instance/components/AddRemoteInstance/FormParts/FormParts.styles';
import { NodesAgentsProps } from 'app/percona/add-instance/components/AddRemoteInstance/FormParts/NodesAgents/NodesAgents.types';
import { GET_NODES_CANCEL_TOKEN } from 'app/percona/inventory/Inventory.constants';
import { NodesOption } from 'app/percona/inventory/Inventory.types';
import { SelectField } from 'app/percona/shared/components/Form/SelectFieldCore';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { nodesOptionsMapper } from 'app/percona/shared/core/reducers/nodes';
import { fetchNodesAction } from 'app/percona/shared/core/reducers/nodes/nodes';
import { getNodes } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { logger } from 'app/percona/shared/helpers/logger';
import { validators } from 'app/percona/shared/helpers/validatorsForm';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types/store';

export const NodesAgents: FC<NodesAgentsProps> = ({ form }) => {
  const styles = useStyles2(getStyles);
  const dispatch = useAppDispatch();
  const [generateToken] = useCancelToken();
  const { nodes } = useSelector(getNodes);
  const {
    input: { value: selectedNode },
  } = useField('node');

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

  // A service monitored by the PMM Server node itself is a remote one, so its address is left for
  // the user to fill in. Any other node runs next to what it monitors, hence the localhost default.
  const prefillAddress = (node?: NodesOption) => {
    if (node && !form?.getState().values?.address) {
      form?.change('address', node.isPMMServerNode ? '' : 'localhost');
    }
  };

  const setNodeAndAgent = (value: NodesOption) => {
    form?.change('node', value);

    // A node running several pmm-agents is ambiguous, so the agent is left for the user to pick.
    const selectedAgent = value.agents?.length === 1 ? value.agents[0] : undefined;

    if (selectedAgent) {
      form?.change('pmm_agent_id', selectedAgent);
      prefillAddress(value);
    } else {
      form?.change('pmm_agent_id', undefined);
    }
  };

  useEffect(() => {
    if (nodesOptions.length === 0) {
      loadData();
    } else if (!selectedNode) {
      // PMM Server reports the nodes it does not want monitoring delegated to, and they are already
      // filtered out. Whatever is left is eligible, the PMM Server node being the natural default
      // where it is still offered - a single-node deployment has no other node to pick.
      const preselectedNode = nodesOptions.find((node) => node.isPMMServerNode) ?? nodesOptions[0];

      if (preselectedNode) {
        setNodeAndAgent(preselectedNode);
      }
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
          aria-label={Messages.form.labels.nodesAgents.nodes}
          validators={[validators.required]}
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
          onChange={() => prefillAddress(selectedNode)}
          className={styles.selectField}
          aria-label={Messages.form.labels.nodesAgents.agents}
          validators={selectedNode ? [validators.required] : undefined}
        />
      </div>
    </div>
  );
};
