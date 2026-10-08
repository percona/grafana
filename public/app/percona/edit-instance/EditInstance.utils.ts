import { AgentType, ServiceAgentListPayload, UpdateAgentItem } from '../inventory/Inventory.types';
import { Databases } from '../shared/core';
import { CustomLabelsUtils } from '../shared/helpers/customLabels';
import { DbServicePayload } from '../shared/services/services/Services.types';

import { EditInstanceFormValues, RdsAuthMode, RdsExporter } from './EditInstance.types';

export const getService = (result: Record<Databases, DbServicePayload>): DbServicePayload =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  result[Object.keys(result)[0] as Databases];

// A remote RDS node carries at most one rds_exporter. Services on any other kind of node have
// none, which is what keeps the credentials section off every non-RDS service.
export const getRdsExporter = (payload?: ServiceAgentListPayload): RdsExporter | undefined => {
  const agent = payload?.agents?.find(({ agent_type }) => agent_type === AgentType.rdsExporter);

  if (!agent) {
    return undefined;
  }

  return {
    agentId: agent.agent_id,
    awsAccessKey: agent.aws_access_key || '',
    awsRoleArn: agent.aws_role_arn || '',
    isAwsSecretKeySet: Boolean(agent.is_aws_secret_key_set),
  };
};

export const getRdsAuthMode = (exporter?: RdsExporter): RdsAuthMode => {
  if (exporter?.awsRoleArn) {
    return RdsAuthMode.iamRole;
  }

  if (exporter?.awsAccessKey || exporter?.isAwsSecretKeySet) {
    return RdsAuthMode.accessKey;
  }

  return RdsAuthMode.hostCredentials;
};

export const getInitialValues = (service?: DbServicePayload, exporter?: RdsExporter): EditInstanceFormValues => {
  const rdsValues: EditInstanceFormValues = exporter
    ? {
        rds_auth_mode: getRdsAuthMode(exporter),
        aws_access_key: exporter.awsAccessKey,
        // The API never returns the secret key, so the field starts empty whether or not one is set.
        aws_secret_key: '',
        aws_role_arn: exporter.awsRoleArn,
      }
    : {};

  if (service) {
    return {
      ...service,
      custom_labels: CustomLabelsUtils.fromPayload(service.custom_labels || {}),
      ...rdsValues,
    };
  }

  return {
    environment: '',
    cluster: '',
    replication_set: '',
    custom_labels: '',
    ...rdsValues,
  };
};

/**
 * Builds the ChangeAgent payload for the selected authentication mode, or undefined when the
 * credentials are untouched so the caller can skip the request entirely.
 *
 * ChangeAgent applies only the fields it is given, and the server rejects a role ARN that arrives
 * alongside an access key. Switching mode therefore has to send the abandoned fields as empty
 * strings - the same thing `pmm-admin ... --aws-role-arn=<arn> --aws-access-key= --aws-secret-key=`
 * does.
 */
export const toRdsCredentialsPayload = (
  values: EditInstanceFormValues,
  exporter?: RdsExporter
): UpdateAgentItem | undefined => {
  if (!exporter) {
    return undefined;
  }

  if (values.rds_auth_mode === RdsAuthMode.iamRole) {
    const roleArn = values.aws_role_arn?.trim() || '';

    if (roleArn === exporter.awsRoleArn) {
      return undefined;
    }

    return { aws_role_arn: roleArn, aws_access_key: '', aws_secret_key: '' };
  }

  if (values.rds_auth_mode === RdsAuthMode.accessKey) {
    const accessKey = values.aws_access_key?.trim() || '';
    const secretKey = values.aws_secret_key || '';
    const keeps = accessKey === exporter.awsAccessKey && !exporter.awsRoleArn;

    if (keeps && !secretKey) {
      return undefined;
    }

    const payload: UpdateAgentItem = { aws_access_key: accessKey, aws_role_arn: '' };

    // An untouched secret field means "keep the stored secret", so it is left out of the payload.
    if (secretKey) {
      payload.aws_secret_key = secretKey;
    }

    return payload;
  }

  // Host credentials: drop everything PMM holds and let the exporter fall back to whatever the
  // pmm-agent host provides. Nothing to do if it is already using them.
  if (!exporter.awsAccessKey && !exporter.awsRoleArn && !exporter.isAwsSecretKeySet) {
    return undefined;
  }

  return { aws_access_key: '', aws_secret_key: '', aws_role_arn: '' };
};
