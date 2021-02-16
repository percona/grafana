import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { dataQa } from '@percona/platform-core';
import { AlertRulesTable } from './AlertRulesTable';
import { act } from 'react-dom/test-utils';
import { AlertRulesProvider } from '../AlertRules.provider';
import { formattedRulesStubs } from '../__mocks__/alertRulesStubs';

const columns = [
  {
    Header: 'test col 1',
    accessor: 'value',
  },
];

const data = [
  {
    value: 'test value 1',
  },
  {
    value: 'test value 2',
  },
];

const onPaginationChanged = jest.fn();

describe('AlertRulesTable', () => {
  it('should render the table correctly', async () => {
    let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

    await act(async () => {
      wrapper = mount(
        <AlertRulesTable
          totalItems={data.length}
          onPaginationChanged={onPaginationChanged}
          data={data}
          columns={columns}
          pageSize={10}
          pageIndex={0}
        />
      );
    });

    wrapper.update();

    expect(wrapper.find(dataQa('alert-rules-table-thead')).find('tr')).toHaveLength(1);
    expect(wrapper.find(dataQa('alert-rules-table-tbody')).find('tr')).toHaveLength(2);
    expect(wrapper.find(dataQa('alert-rules-table-no-data'))).toHaveLength(0);
    expect(wrapper.find(dataQa('alert-rules-details'))).toHaveLength(0);
  });

  it('should render rule details when rule is selected', async () => {
    const alertRulesContext = {
      getAlertRules: jest.fn(),
      setAddModalVisible: jest.fn(),
      setSelectedAlertRule: jest.fn(),
      setSelectedRuleDetails: jest.fn(),
      selectedRuleDetails: formattedRulesStubs[0],
    };
    const wrapper = mount(
      <AlertRulesProvider.Provider value={alertRulesContext}>
        <AlertRulesTable
          totalItems={data.length}
          onPaginationChanged={onPaginationChanged}
          data={formattedRulesStubs}
          columns={columns}
          emptyMessage="empty"
          pageSize={10}
          pageIndex={0}
        />
      </AlertRulesProvider.Provider>
    );
    const details = wrapper.find(dataQa('alert-rules-details'));
    expect(details.text().length).toBeGreaterThan(0);
  });
});
