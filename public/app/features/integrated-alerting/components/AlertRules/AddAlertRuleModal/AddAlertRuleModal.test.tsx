import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { dataQa } from '@percona/platform-core';
import { AddAlertRuleModal } from './AddAlertRuleModal';
import { AlertRuleTemplateService } from '../../AlertRuleTemplate/AlertRuleTemplate.service';
import { templateStubs } from '../../AlertRuleTemplate/__mocks__/alertRuleTemplateStubs';

// TODO: improve coverage

jest.mock('../AlertRules.service');
jest.mock('../../AlertRuleTemplate/AlertRuleTemplate.service');
jest.mock('app/core/app_events', () => {
  return {
    appEvents: {
      emit: jest.fn(),
    },
  };
});

const alertRuleTemplateServiceList = jest.spyOn(AlertRuleTemplateService, 'list').mockImplementation(() =>
  Promise.resolve({
    templates: templateStubs,
  })
);

describe('AddAlertRuleModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('doesn not render the modal when visible is set to false', async () => {
    let wrapper: ReactWrapper<{}, {}, any>;

    await act(async () => {
      wrapper = mount(<AddAlertRuleModal setVisible={jest.fn()} isVisible={false} />);
    });

    expect(wrapper.find(dataQa('add-alert-rule-modal-form')).length).toBe(0);

    wrapper.unmount();
  });

  it('renders the modal when visible is set to true', async () => {
    let wrapper: ReactWrapper<{}, {}, any>;

    await act(async () => {
      wrapper = mount(<AddAlertRuleModal setVisible={jest.fn()} isVisible />);
    });

    expect(wrapper.find(dataQa('add-alert-rule-modal-form')).length).toBe(1);

    wrapper.unmount();
  });

  it('gets the templates when mounted', async () => {
    let wrapper: ReactWrapper<{}, {}, any>;

    await act(async () => {
      wrapper = mount(<AddAlertRuleModal setVisible={jest.fn()} isVisible />);
    });

    expect(alertRuleTemplateServiceList).toBeCalledTimes(1);

    wrapper.unmount();
  });
});
