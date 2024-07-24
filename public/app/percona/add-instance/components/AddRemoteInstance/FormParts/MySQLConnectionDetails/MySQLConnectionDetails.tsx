import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useStyles2 } from '@grafana/ui';
import { GET_NODES_CANCEL_TOKEN } from "app/percona/inventory/Inventory.constants";
import { AgentsOptions, NodesOptions } from "app/percona/inventory/Inventory.types";
import { PasswordInputField } from 'app/percona/shared/components/Form/PasswordInput';
import { SelectField } from "app/percona/shared/components/Form/SelectFieldCore";
import { TextInputField } from 'app/percona/shared/components/Form/TextInput';
import { useCancelToken } from "app/percona/shared/components/hooks/cancelToken.hook";
import { fetchNodesOptionsAction } from "app/percona/shared/core/reducers/nodes/nodes";
import { isApiCancelError } from "app/percona/shared/helpers/api";
import { logger } from "app/percona/shared/helpers/logger";
import Validators from 'app/percona/shared/helpers/validators';
import { validators } from 'app/percona/shared/helpers/validatorsForm';
import { useAppDispatch } from "app/store/store";

import { Messages } from '../FormParts.messages';
import { getStyles } from '../FormParts.styles';
import { MainDetailsFormPartProps } from '../FormParts.types';

export const MySQLConnectionDetails: FC<MainDetailsFormPartProps> = ({ form, remoteInstanceCredentials }) => {
  const styles = useStyles2(getStyles);
  const formValues = form && form.getState().values;
  const tlsFlag = formValues && formValues['tls'];
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

  useEffect(() => {
    if(nodes.length === 0) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  const portValidators = useMemo(() => [validators.required, Validators.validatePort], []);
  const userPassValidators = useMemo(() => (tlsFlag ? [] : [validators.required]), [tlsFlag]);
  const maxQueryLengthValidators = useMemo(() => [Validators.min(-1)], []);

  const setNodeAndAgent = (value: NodesOptions) => {
    setSelectedNode(value);
    if (value.agents && value.agents.length > 1) {
      form?.change('agent', value.agents[1]);
    } else if (value.agents && value.agents.length === 1) {
      form?.change('agent', value.agents[0]);
    }

    if(selectedAgent && selectedAgent.value !== "pmm-server") {
      form?.change('address', 'localhost');
    }
  }

  return (
    <div className={styles.groupWrapper}>
      <h4 className={styles.sectionHeader}>{Messages.form.titles.mainDetails}</h4>
      <div className={styles.group}>
        <TextInputField
          data-testid="service-name-label"
          name="serviceName"
          label={Messages.form.labels.mainDetails.serviceName}
          tooltipText={Messages.form.tooltips.mainDetails.serviceName}
          placeholder={Messages.form.placeholders.mainDetails.serviceName}
        />
        <div />
      </div>
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
            name="agent"
            data-testid="nodes-label"
            onChange={ (event) => { setSelectedAgent(event as AgentsOptions); }}
            className={styles.selectField}
          />
        </div>
      </div>

      <div className={styles.group}>
        <TextInputField
          name="address"
          label={Messages.form.labels.mainDetails.address}
          tooltipText={Messages.form.tooltips.mainDetails.address}
          placeholder={Messages.form.placeholders.mainDetails.address}
          validators={[validators.required]}
          disabled={remoteInstanceCredentials.isRDS}
        />
        <TextInputField
          name="port"
          label={Messages.form.labels.mainDetails.port}
          tooltipText={Messages.form.tooltips.mainDetails.port}
          placeholder={`Port (default: ${remoteInstanceCredentials.port} )`}
          validators={portValidators}
        />
      </div>
      <div className={styles.group}>
        <TextInputField
          key={`username-${tlsFlag}`}
          name="username"
          label={Messages.form.labels.mainDetails.username}
          tooltipText={Messages.form.tooltips.mainDetails.username}
          placeholder={Messages.form.placeholders.mainDetails.username}
          validators={userPassValidators}
        />
        <PasswordInputField
          key={`password-${tlsFlag}`}
          name="password"
          label={Messages.form.labels.mainDetails.password}
          tooltipText={Messages.form.tooltips.mainDetails.password}
          placeholder={Messages.form.placeholders.mainDetails.password}
          validators={userPassValidators}
        />
      </div>
      <div className={styles.group}>
        <TextInputField
          key="maxQueryLength"
          name="maxQueryLength"
          label={Messages.form.labels.mysqlDetails.maxQueryLength}
          tooltipText={Messages.form.tooltips.mysqlDetails.maxQueryLength}
          placeholder={Messages.form.placeholders.mysqlDetails.maxQueryLength}
          validators={maxQueryLengthValidators}
        />
        <div />
      </div>
    </div>
  );
};
