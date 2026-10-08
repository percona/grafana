import { render, screen, fireEvent } from '@testing-library/react';

import Credentials from './Credentials';

const ROLE_ARN = 'arn:aws:iam::123456789012:role/PmmRdsMonitoring';

describe('Credentials:: ', () => {
  it('should render access key, secret key and role ARN fields', () => {
    render(<Credentials discover={jest.fn()} />);

    expect(screen.getByTestId('aws_access_key-text-input')).toBeInTheDocument();
    expect(screen.getByTestId('aws_secret_key-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('aws_role_arn-text-input')).toBeInTheDocument();
  });

  it('should call discover on submit with no credentials (ambient identity)', () => {
    const discover = jest.fn();
    render(<Credentials discover={discover} />);

    fireEvent.submit(screen.getByTestId('credentials-form'));

    expect(discover).toHaveBeenCalled();
  });

  it('should pass the role ARN to discover', () => {
    const discover = jest.fn();
    render(<Credentials discover={discover} />);

    fireEvent.change(screen.getByTestId('aws_role_arn-text-input'), { target: { value: ROLE_ARN } });
    fireEvent.submit(screen.getByTestId('credentials-form'));

    expect(discover).toHaveBeenCalledWith(expect.objectContaining({ aws_role_arn: ROLE_ARN }));
  });

  it('should block discover when a role ARN is combined with an access key', () => {
    const discover = jest.fn();
    render(<Credentials discover={discover} />);

    fireEvent.change(screen.getByTestId('aws_access_key-text-input'), { target: { value: 'AKIAIOSFODNN7EXAMPLE' } });
    fireEvent.change(screen.getByTestId('aws_role_arn-text-input'), { target: { value: ROLE_ARN } });
    fireEvent.submit(screen.getByTestId('credentials-form'));

    expect(discover).not.toHaveBeenCalled();
    expect(screen.getByTestId('aws_access_key-text-input').classList.contains('invalid')).toBe(true);
    expect(screen.getByTestId('aws_role_arn-text-input').classList.contains('invalid')).toBe(true);
  });

  it('should block discover on a malformed role ARN', () => {
    const discover = jest.fn();
    render(<Credentials discover={discover} />);

    fireEvent.change(screen.getByTestId('aws_role_arn-text-input'), {
      target: { value: 'arn:aws:iam::123456789012:instance-profile/pmm-ec2-role' },
    });
    fireEvent.submit(screen.getByTestId('credentials-form'));

    expect(discover).not.toHaveBeenCalled();
    expect(screen.getByTestId('aws_role_arn-text-input').classList.contains('invalid')).toBe(true);
  });
});
