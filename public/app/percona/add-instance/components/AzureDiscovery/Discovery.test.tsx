import { mount } from 'enzyme';
import React from 'react';
import Discovery from './Discovery';

describe('Discovery instance:: ', () => {
  it('Should render correct', () => {
    const selectInstance = jest.fn();

    const root = mount(<Discovery selectInstance={selectInstance} />);

    expect(root.find('input[data-qa="azure_client_id-text-input"]').length).toBe(1);
    expect(root.find('input[data-qa="azure_client_secret-password-input"]').length).toBe(1);
    expect(root.find('input[data-qa="azure_tenant_id-text-input"]').length).toBe(1);
    expect(root.find('input[data-qa="azure_subscription_id-text-input"]').length).toBe(1);
    expect(root.find('button[data-qa="credentials-search-button"]').length).toBe(1);
  });
});
