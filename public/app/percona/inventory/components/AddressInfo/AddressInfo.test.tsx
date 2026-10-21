import { render, screen } from '@testing-library/react';

import { AddressInfo } from './AddressInfo';
import { ADDRESS_DOCS_LINK, Messages } from './AddressInfo.messages';

describe('AddressInfo', () => {
  it('explains the address and links to the docs in a new tab', () => {
    render(<AddressInfo />);

    expect(screen.getByText(Messages.description, { exact: false })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: new RegExp(Messages.learnMore) });
    expect(link).toHaveAttribute('href', ADDRESS_DOCS_LINK);
    expect(link).toHaveAttribute('target', '_blank');
  });
});
