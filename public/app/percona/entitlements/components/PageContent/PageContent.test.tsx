import { mount } from 'enzyme';
import { dataTestId } from '@percona/platform-core';
import { PageContent } from './PageContent';
import React from 'react';

describe('PageContent', () => {
  it('should display the noData section when no data is passed', async () => {
    const wrapper = mount(<PageContent hasData={false} emptyMessage="empty" />);
    const noData = wrapper.find(dataTestId('page-no-data'));

    expect(noData).toHaveLength(1);
    expect(noData.text()).toEqual('empty');
  });

  it('should not display the noData section when no data is passed and it is still loading', async () => {
    const wrapper = mount(<PageContent loading={true} hasData={false} emptyMessage="empty" />);
    const noData = wrapper.find(dataTestId('page-no-data'));

    expect(noData).toHaveLength(1);
    expect(noData.text()).toHaveLength(0);
  });

  it('should display the page when there is data', async () => {
    const Dummy = () => <span></span>;
    const wrapper = mount(
      <PageContent hasData={true} emptyMessage="no data">
        <Dummy />
      </PageContent>
    );

    expect(wrapper.find(dataTestId('page-no-data'))).toHaveLength(0);
    expect(wrapper.find(Dummy).exists()).toBeTruthy();
  });
});
