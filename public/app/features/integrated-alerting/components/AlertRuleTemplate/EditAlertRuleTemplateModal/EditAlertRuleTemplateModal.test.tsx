import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { dataQa } from '@percona/platform-core';
import { EditAlertRuleTemplateModal } from './EditAlertRuleTemplateModal';

jest.mock('../AlertRuleTemplate.service');

describe('EditAlertRuleTemplateModal', () => {
  it('should render component correctly', () => {
    const wrapper = mount(<EditAlertRuleTemplateModal setVisible={jest.fn()} isVisible yaml="" />);
    const addButton = wrapper.find(dataQa('alert-rule-template-edit-button')).find('button');

    expect(wrapper.find('textarea')).toBeTruthy();
    expect(addButton).toBeTruthy();
    expect(addButton.prop('disabled')).toBeTruthy();
  });

  it('should not render modal when visible is set to false', () => {
    const wrapper = mount(<EditAlertRuleTemplateModal setVisible={jest.fn()} isVisible={false} yaml="" />);

    expect(wrapper.contains('textarea')).toBeFalsy();
  });

  it('should call setVisible on close', () => {
    const setVisible = jest.fn();
    const wrapper = mount(<EditAlertRuleTemplateModal setVisible={setVisible} isVisible yaml="" />);

    wrapper.find(dataQa('modal-background')).simulate('click');

    expect(setVisible).toHaveBeenCalled();
  });

  it('should render yaml content passed', () => {
    const wrapper = mount(<EditAlertRuleTemplateModal setVisible={jest.fn()} isVisible yaml="test content" />);
    const addButton = wrapper.find(dataQa('alert-rule-template-edit-button')).find('button');

    expect(wrapper.find('textarea').text()).toEqual('test content');
    expect(addButton.prop('disabled')).toBeTruthy();
  });

  it('should call setVisible on submit', async () => {
    const setVisible = jest.fn();
    const wrapper = mount(<EditAlertRuleTemplateModal setVisible={setVisible} isVisible yaml="" />);

    wrapper.find('textarea').simulate('change', { target: { value: 'test content' } });

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });

    expect(setVisible).toHaveBeenCalledWith(false);
  });
});
