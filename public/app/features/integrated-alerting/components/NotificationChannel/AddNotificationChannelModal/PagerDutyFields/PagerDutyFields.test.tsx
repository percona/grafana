import React from 'react';
import { mount } from 'enzyme';
import { Form } from 'react-final-form';
import { dataQa } from '@percona/platform-core';
import { PagerDutyFields } from './PagerDutyFields';

describe('PagerDutyFields', () => {
  it('should render correct fields', () => {
    const wrapper = mount(<Form onSubmit={jest.fn()} render={() => <PagerDutyFields />} />);

    expect(wrapper.find(dataQa('routing-text-input')).length).toBe(1);
    expect(wrapper.find(dataQa('service-text-input')).length).toBe(1);
  });
});
