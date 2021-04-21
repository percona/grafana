import React from 'react';
import { shallow } from 'enzyme';
import { LabelWrapper } from './LabelWrapper';

describe('LabelWrapper', () => {
  it('should render', () => {
    const wrapper = shallow(<LabelWrapper label="label" />);
    expect(wrapper.find('label').exists()).toBeTruthy();
  });
});
