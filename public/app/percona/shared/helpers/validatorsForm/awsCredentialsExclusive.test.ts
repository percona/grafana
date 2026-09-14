import { awsCredentialsExclusive } from './awsCredentialsExclusive';

describe('awsCredentialsExclusive validator', () => {
  it('passes when no credentials are set (ambient identity)', () => {
    expect(awsCredentialsExclusive('', {})).toBeUndefined();
    expect(awsCredentialsExclusive('', undefined)).toBeUndefined();
  });

  it('passes with only an access key and secret key', () => {
    expect(awsCredentialsExclusive('', { aws_access_key: 'AKIA', aws_secret_key: 'secret' })).toBeUndefined();
  });

  it('passes with only a role ARN', () => {
    expect(awsCredentialsExclusive('', { aws_role_arn: 'arn:aws:iam::123456789012:role/r' })).toBeUndefined();
  });

  it('fails when an access key is combined with a role ARN', () => {
    expect(
      awsCredentialsExclusive('', { aws_access_key: 'AKIA', aws_role_arn: 'arn:aws:iam::123456789012:role/r' })
    ).toEqual(expect.any(String));
  });

  it('fails when a secret key alone is combined with a role ARN', () => {
    expect(
      awsCredentialsExclusive('', { aws_secret_key: 'secret', aws_role_arn: 'arn:aws:iam::123456789012:role/r' })
    ).toEqual(expect.any(String));
  });

  it('ignores its own value and decides from the sibling fields', () => {
    const values = { aws_access_key: 'AKIA', aws_role_arn: 'arn:aws:iam::123456789012:role/r' };
    expect(awsCredentialsExclusive('AKIA', values)).toEqual(expect.any(String));
    expect(awsCredentialsExclusive('arn:aws:iam::123456789012:role/r', values)).toEqual(expect.any(String));
  });
});
