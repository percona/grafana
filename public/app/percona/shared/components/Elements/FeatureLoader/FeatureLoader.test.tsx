import React from 'React';
import { mount, ReactWrapper } from 'enzyme';
import { FeatureLoader } from './FeatureLoader';
import { act } from 'react-dom/test-utils';
import { EmptyBlock } from 'app/features/integrated-alerting/components/EmptyBlock';

jest.mock('./FeatureLoader.service');

describe('FeatureLoader', () => {
  it('should not have children initially', async () => {
    let wrapper: ReactWrapper;
    const Dummy = () => <></>;
    await act(async () => {
      wrapper = mount(
        <FeatureLoader featureName="IA" featureFlag="alerting_enabled">
          <Dummy />
        </FeatureLoader>
      );
    });
    expect(wrapper.find(Dummy).exists()).toBeFalsy();
    expect(wrapper.find(EmptyBlock).exists()).toBeTruthy();
  });

  it('should show children after loading settings', async () => {
    let wrapper: ReactWrapper;
    const Dummy = () => <></>;
    await act(async () => {
      wrapper = mount(
        <FeatureLoader featureName="IA" featureFlag="alerting_enabled">
          <Dummy />
        </FeatureLoader>
      );
    });
    wrapper.update();
    expect(wrapper.find(Dummy).exists()).toBeTruthy();
    expect(wrapper.find(EmptyBlock).exists()).toBeFalsy();
  });
});
