import { render, screen, fireEvent } from '@testing-library/react';

import Credentials from './Credentials';

describe('Credentials:: ', () => {
  it('should render access key, secret key, and role ARN fields in order', () => {
    render(<Credentials discover={jest.fn()} />);

    const accessKeyInput = screen.getByTestId('aws_access_key-text-input');
    const secretKeyInput = screen.getByTestId('aws_secret_key-password-input');
    const roleArnInput = screen.getByTestId('aws_role_arn-text-input');

    expect(accessKeyInput).toBeInTheDocument();
    expect(secretKeyInput).toBeInTheDocument();
    expect(roleArnInput).toBeInTheDocument();
    expect(accessKeyInput.compareDocumentPosition(secretKeyInput)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(secretKeyInput.compareDocumentPosition(roleArnInput)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('should call discover on submit', () => {
    const discover = jest.fn();
    render(<Credentials discover={discover} />);

    const form = screen.getByTestId('credentials-form');
    fireEvent.change(screen.getByTestId('aws_role_arn-text-input'), {
      target: { value: 'arn:aws:iam::123456789012:role/PmmRdsReadOnlyRole' },
    });
    fireEvent.submit(form);

    expect(discover).toHaveBeenCalledWith(
      expect.objectContaining({ aws_role_arn: 'arn:aws:iam::123456789012:role/PmmRdsReadOnlyRole' })
    );
  });
});
