import React from 'react';
import { mount } from 'enzyme';
import { AsyncSelect } from '@grafana/ui';
import { LabelWrapper } from '../LabelWrapper';
import { AsyncSelectField } from './AsyncSelectField';

describe('AsyncSelectField', () => {
  it('should render', () => {
    const wrapper = mount(<AsyncSelectField label="label" name="name" onChange={jest.fn()} />);
    expect(wrapper.find(LabelWrapper).exists()).toBeTruthy();
    expect(wrapper.find(AsyncSelect).exists()).toBeTruthy();
  });
});
