import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { dataQa } from '@percona/platform-core';
import { IntegratedAlertingContent } from './IntegratedAlertingContent';
import { Spinner } from '@grafana/ui';
import { EmptyBlock } from '../EmptyBlock';
import { IntegratedAlertingTabs } from './IntegratedAlertingTabs';

describe('IntegratedAlertingContent', () => {
  describe('IA disabled', () => {
    it('should display empty block', async () => {
      let wrapper: ShallowWrapper;

      await act(async () => {
        wrapper = await shallow(<IntegratedAlertingContent alertingEnabled={false} loadingSettings={false} />);
      });
      expect(wrapper.find(EmptyBlock).exists()).toBeTruthy();
    });

    it('should display a loading state while pending', async () => {
      let wrapper: ShallowWrapper;

      await act(async () => {
        wrapper = await shallow(<IntegratedAlertingContent alertingEnabled={false} loadingSettings={true} />);
      });
      expect(wrapper.find(Spinner).exists()).toBeTruthy();
    });

    it('should display a link to settings when loading is done', async () => {
      let wrapper: ShallowWrapper;

      await act(async () => {
        wrapper = await shallow(<IntegratedAlertingContent alertingEnabled={false} loadingSettings={false} />);
      });
      expect(wrapper.find(dataQa('ia-settings-link')).exists()).toBeTruthy();
    });
  });

  describe('IA enabled', () => {
    it('should display IntegratedAlertingTabs', async () => {
      let wrapper: ShallowWrapper;

      await act(async () => {
        wrapper = await shallow(<IntegratedAlertingContent alertingEnabled={true} loadingSettings={false} />);
      });
      expect(wrapper.find(IntegratedAlertingTabs).exists()).toBeTruthy();
    });
  });
});
