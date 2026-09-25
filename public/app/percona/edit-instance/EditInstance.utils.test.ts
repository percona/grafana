import { AgentType, ServiceAgentStatus } from '../inventory/Inventory.types';

import { RdsAuthMode, RdsExporter } from './EditInstance.types';
import { getRdsAuthMode, getRdsExporter, toRdsCredentialsPayload } from './EditInstance.utils';

const ROLE_ARN = 'arn:aws:iam::123456789012:role/PmmRdsMonitoring';

const withKeys: RdsExporter = {
  agentId: 'agent_id',
  awsAccessKey: 'AKIAIOSFODNN7EXAMPLE',
  awsRoleArn: '',
  isAwsSecretKeySet: true,
};

const withRole: RdsExporter = {
  agentId: 'agent_id',
  awsAccessKey: '',
  awsRoleArn: ROLE_ARN,
  isAwsSecretKeySet: false,
};

const withHostCredentials: RdsExporter = {
  agentId: 'agent_id',
  awsAccessKey: '',
  awsRoleArn: '',
  isAwsSecretKeySet: false,
};

describe('getRdsExporter::', () => {
  it('picks the rds_exporter out of the node agents', () => {
    const exporter = getRdsExporter({
      agents: [
        { agent_id: 'node_exporter_id', agent_type: AgentType.nodeExporter, status: ServiceAgentStatus.RUNNING },
        {
          agent_id: 'rds_exporter_id',
          agent_type: AgentType.rdsExporter,
          status: ServiceAgentStatus.RUNNING,
          aws_access_key: 'AKIAIOSFODNN7EXAMPLE',
          is_aws_secret_key_set: true,
        },
      ],
    });

    expect(exporter).toEqual({
      agentId: 'rds_exporter_id',
      awsAccessKey: 'AKIAIOSFODNN7EXAMPLE',
      awsRoleArn: '',
      isAwsSecretKeySet: true,
    });
  });

  it('returns undefined when the node has no rds_exporter', () => {
    expect(
      getRdsExporter({
        agents: [{ agent_id: 'id', agent_type: AgentType.mysqldExporter, status: ServiceAgentStatus.RUNNING }],
      })
    ).toBeUndefined();
    expect(getRdsExporter({ agents: [] })).toBeUndefined();
    expect(getRdsExporter(undefined)).toBeUndefined();
  });
});

describe('getRdsAuthMode::', () => {
  it('derives the mode from what the exporter holds', () => {
    expect(getRdsAuthMode(withRole)).toBe(RdsAuthMode.iamRole);
    expect(getRdsAuthMode(withKeys)).toBe(RdsAuthMode.accessKey);
    expect(getRdsAuthMode(withHostCredentials)).toBe(RdsAuthMode.hostCredentials);
    expect(getRdsAuthMode(undefined)).toBe(RdsAuthMode.hostCredentials);
  });

  it('treats a stored secret with no access key as key authentication', () => {
    expect(getRdsAuthMode({ ...withHostCredentials, isAwsSecretKeySet: true })).toBe(RdsAuthMode.accessKey);
  });
});

describe('toRdsCredentialsPayload::', () => {
  it('does nothing without an exporter', () => {
    expect(toRdsCredentialsPayload({ rds_auth_mode: RdsAuthMode.iamRole, aws_role_arn: ROLE_ARN })).toBeUndefined();
  });

  describe('migrating to an IAM role', () => {
    it('clears both keys in the same call', () => {
      expect(toRdsCredentialsPayload({ rds_auth_mode: RdsAuthMode.iamRole, aws_role_arn: ROLE_ARN }, withKeys)).toEqual(
        { aws_role_arn: ROLE_ARN, aws_access_key: '', aws_secret_key: '' }
      );
    });

    it('trims the role ARN', () => {
      expect(
        toRdsCredentialsPayload({ rds_auth_mode: RdsAuthMode.iamRole, aws_role_arn: `  ${ROLE_ARN}  ` }, withKeys)
      ).toEqual({ aws_role_arn: ROLE_ARN, aws_access_key: '', aws_secret_key: '' });
    });

    it('skips the call when the role is unchanged', () => {
      expect(
        toRdsCredentialsPayload({ rds_auth_mode: RdsAuthMode.iamRole, aws_role_arn: ROLE_ARN }, withRole)
      ).toBeUndefined();
    });

    it('sends a changed role even when the exporter already uses one', () => {
      const other = 'arn:aws:iam::123456789012:role/Other';

      expect(toRdsCredentialsPayload({ rds_auth_mode: RdsAuthMode.iamRole, aws_role_arn: other }, withRole)).toEqual({
        aws_role_arn: other,
        aws_access_key: '',
        aws_secret_key: '',
      });
    });
  });

  describe('migrating to an access key', () => {
    it('clears the role ARN in the same call', () => {
      expect(
        toRdsCredentialsPayload(
          { rds_auth_mode: RdsAuthMode.accessKey, aws_access_key: 'AKIANEW', aws_secret_key: 'secret' },
          withRole
        )
      ).toEqual({ aws_access_key: 'AKIANEW', aws_secret_key: 'secret', aws_role_arn: '' });
    });

    it('omits an untouched secret key so the stored one is kept', () => {
      expect(
        toRdsCredentialsPayload(
          { rds_auth_mode: RdsAuthMode.accessKey, aws_access_key: 'AKIANEW', aws_secret_key: '' },
          withKeys
        )
      ).toEqual({ aws_access_key: 'AKIANEW', aws_role_arn: '' });
    });

    it('skips the call when nothing about the key changed', () => {
      expect(
        toRdsCredentialsPayload(
          { rds_auth_mode: RdsAuthMode.accessKey, aws_access_key: withKeys.awsAccessKey, aws_secret_key: '' },
          withKeys
        )
      ).toBeUndefined();
    });

    it('sends a new secret for the same access key', () => {
      expect(
        toRdsCredentialsPayload(
          { rds_auth_mode: RdsAuthMode.accessKey, aws_access_key: withKeys.awsAccessKey, aws_secret_key: 'rotated' },
          withKeys
        )
      ).toEqual({ aws_access_key: withKeys.awsAccessKey, aws_secret_key: 'rotated', aws_role_arn: '' });
    });
  });

  describe('falling back to host credentials', () => {
    it('clears everything PMM holds', () => {
      expect(toRdsCredentialsPayload({ rds_auth_mode: RdsAuthMode.hostCredentials }, withRole)).toEqual({
        aws_access_key: '',
        aws_secret_key: '',
        aws_role_arn: '',
      });
      expect(toRdsCredentialsPayload({ rds_auth_mode: RdsAuthMode.hostCredentials }, withKeys)).toEqual({
        aws_access_key: '',
        aws_secret_key: '',
        aws_role_arn: '',
      });
    });

    it('skips the call when the exporter already uses them', () => {
      expect(
        toRdsCredentialsPayload({ rds_auth_mode: RdsAuthMode.hostCredentials }, withHostCredentials)
      ).toBeUndefined();
    });

    it('still clears a stored secret that has no access key beside it', () => {
      expect(
        toRdsCredentialsPayload(
          { rds_auth_mode: RdsAuthMode.hostCredentials },
          { ...withHostCredentials, isAwsSecretKeySet: true }
        )
      ).toEqual({ aws_access_key: '', aws_secret_key: '', aws_role_arn: '' });
    });
  });
});
