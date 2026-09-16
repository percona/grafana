import { fireEvent, render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import { EditInstanceFormValues, RdsAuthMode, RdsExporter } from '../../EditInstance.types';

import { RdsCredentials } from './RdsCredentials';

const ROLE_ARN = 'arn:aws:iam::123456789012:role/PmmRdsMonitoring';

const withKeys: RdsExporter = {
  agentId: 'agent_id',
  awsAccessKey: 'AKIAIOSFODNN7EXAMPLE',
  awsRoleArn: '',
  isAwsSecretKeySet: true,
};

const renderSection = (exporter: RdsExporter, initialValues: EditInstanceFormValues, onSubmit = jest.fn()) => {
  render(
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, values }) => (
        <form onSubmit={handleSubmit} data-testid="rds-credentials-form">
          <RdsCredentials exporter={exporter} mode={values.rds_auth_mode} />
        </form>
      )}
    />
  );

  return onSubmit;
};

describe('RdsCredentials::', () => {
  it('offers the three authentication modes', () => {
    renderSection(withKeys, { rds_auth_mode: RdsAuthMode.accessKey });

    expect(screen.getAllByTestId('rds_auth_mode-radio-button')).toHaveLength(3);
  });

  it('shows only the access key inputs in access key mode', () => {
    renderSection(withKeys, { rds_auth_mode: RdsAuthMode.accessKey, aws_access_key: withKeys.awsAccessKey });

    expect(screen.getByTestId('aws_access_key-text-input')).toBeInTheDocument();
    expect(screen.getByTestId('aws_secret_key-password-input')).toBeInTheDocument();
    expect(screen.queryByTestId('aws_role_arn-text-input')).not.toBeInTheDocument();
  });

  it('shows only the role ARN input in IAM role mode', () => {
    renderSection(withKeys, { rds_auth_mode: RdsAuthMode.iamRole });

    expect(screen.getByTestId('aws_role_arn-text-input')).toBeInTheDocument();
    expect(screen.queryByTestId('aws_access_key-text-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('aws_secret_key-password-input')).not.toBeInTheDocument();
  });

  it('explains what host credentials mean and asks for nothing', () => {
    renderSection(withKeys, { rds_auth_mode: RdsAuthMode.hostCredentials });

    expect(screen.getByTestId('rds-host-credentials-note')).toBeInTheDocument();
    expect(screen.queryByTestId('aws_access_key-text-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('aws_role_arn-text-input')).not.toBeInTheDocument();
  });

  it('says the stored secret is kept when the field is left blank', () => {
    renderSection(withKeys, { rds_auth_mode: RdsAuthMode.accessKey, aws_access_key: withKeys.awsAccessKey });

    expect(screen.getByTestId('aws_secret_key-password-input')).toHaveAttribute(
      'placeholder',
      'Leave blank to keep the current secret key'
    );
  });

  it('blocks submit on a malformed role ARN', () => {
    const onSubmit = renderSection(withKeys, { rds_auth_mode: RdsAuthMode.iamRole });

    fireEvent.change(screen.getByTestId('aws_role_arn-text-input'), {
      target: { value: 'arn:aws:iam::123456789012:instance-profile/pmm-ec2-role' },
    });
    fireEvent.submit(screen.getByTestId('rds-credentials-form'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('aws_role_arn-text-input').classList.contains('invalid')).toBe(true);
  });

  it('accepts a well formed role ARN', () => {
    const onSubmit = renderSection(withKeys, { rds_auth_mode: RdsAuthMode.iamRole });

    fireEvent.change(screen.getByTestId('aws_role_arn-text-input'), { target: { value: ROLE_ARN } });
    fireEvent.submit(screen.getByTestId('rds-credentials-form'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ aws_role_arn: ROLE_ARN }),
      expect.anything(),
      expect.anything()
    );
  });

  it('keeps the stored secret while the access key is untouched', () => {
    const onSubmit = renderSection(withKeys, {
      rds_auth_mode: RdsAuthMode.accessKey,
      aws_access_key: withKeys.awsAccessKey,
    });

    fireEvent.submit(screen.getByTestId('rds-credentials-form'));

    expect(onSubmit).toHaveBeenCalled();
  });

  it('demands a secret key once the access key changes', () => {
    const onSubmit = renderSection(withKeys, {
      rds_auth_mode: RdsAuthMode.accessKey,
      aws_access_key: withKeys.awsAccessKey,
    });

    fireEvent.change(screen.getByTestId('aws_access_key-text-input'), { target: { value: 'AKIAROTATEDKEY' } });
    fireEvent.submit(screen.getByTestId('rds-credentials-form'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('aws_secret_key-password-input').classList.contains('invalid')).toBe(true);
  });
});
