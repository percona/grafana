import { awsRoleArn } from './awsRoleArn';

describe('awsRoleArn validator', () => {
  it('passes for empty or undefined value (optional field)', () => {
    expect(awsRoleArn('')).toBeUndefined();
    expect(awsRoleArn(undefined)).toBeUndefined();
  });

  it('passes for a role ARN in the aws partition', () => {
    expect(awsRoleArn('arn:aws:iam::123456789012:role/PmmRdsMonitoring')).toBeUndefined();
  });

  it('passes for a role ARN in another partition', () => {
    expect(awsRoleArn('arn:aws-us-gov:iam::123456789012:role/PmmRdsMonitoring')).toBeUndefined();
  });

  it('passes for a role with a path', () => {
    expect(awsRoleArn('arn:aws:iam::123456789012:role/service/PmmRdsMonitoring')).toBeUndefined();
  });

  it('fails for an instance profile ARN', () => {
    expect(awsRoleArn('arn:aws:iam::123456789012:instance-profile/pmm-ec2-role')).toEqual(expect.any(String));
  });

  it('fails for an assumed-role session ARN', () => {
    expect(awsRoleArn('arn:aws:sts::123456789012:assumed-role/pmm-ec2-role/i-0abc')).toEqual(expect.any(String));
  });

  it('fails when the account id is not twelve digits', () => {
    expect(awsRoleArn('arn:aws:iam::12345:role/PmmRdsMonitoring')).toEqual(expect.any(String));
  });

  it('fails for a bare role name', () => {
    expect(awsRoleArn('PmmRdsMonitoring')).toEqual(expect.any(String));
  });
});
