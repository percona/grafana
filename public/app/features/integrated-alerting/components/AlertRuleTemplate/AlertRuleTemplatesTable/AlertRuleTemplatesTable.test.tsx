import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { dataQa } from '@percona/platform-core';
import { AlertRuleTemplatesTable } from './AlertRuleTemplatesTable';
import { AlertRuleTemplateService } from '../AlertRuleTemplate.service';
import { act } from 'react-dom/test-utils';
import { templateStubs } from '../__mocks__/alertRuleTemplateStubs';

jest.spyOn(AlertRuleTemplateService, 'list').mockImplementation(() =>
  Promise.resolve({
    templates: templateStubs,
  })
);

describe('AddAlertRuleTemplatesTable', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the table correctly', async () => {
    let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

    await act(async () => {
      wrapper = mount(<AlertRuleTemplatesTable />);
    });

    wrapper.update();

    expect(wrapper.find(dataQa('alert-rule-templates-table-thead')).find('tr')).toHaveLength(1);
    expect(wrapper.find(dataQa('alert-rule-templates-table-tbody')).find('tr')).toHaveLength(3);
    expect(wrapper.find(dataQa('alert-rule-templates-table-no-data'))).toHaveLength(0);
  });

  it('should not render modal when visible is set to false', async () => {
    jest.spyOn(AlertRuleTemplateService, 'list').mockImplementation(() => {
      throw Error('test error');
    });

    let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

    await act(async () => {
      wrapper = mount(<AlertRuleTemplatesTable />);
    });

    wrapper.update();

    expect(wrapper.find(dataQa('alert-rule-templates-table-no-data'))).toHaveLength(1);
  });
});
