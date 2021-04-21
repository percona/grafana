import React from 'react';
import { mount } from 'enzyme';
import { Select } from '@grafana/ui';
import { LabelWrapper } from '../LabelWrapper';
import { SelectField } from './SelectField';

describe('SelectField', () => {
  it('should render', () => {
    const wrapper = mount(<SelectField label="label" name="name" onChange={jest.fn()} />);
    expect(wrapper.find(LabelWrapper).exists()).toBeTruthy();
    expect(wrapper.find(Select).exists()).toBeTruthy();
  });
});
