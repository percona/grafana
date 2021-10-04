import React from 'react';
import { mount } from 'enzyme';
import { dataTestId } from '@percona/platform-core';
import { Slack } from './Slack';

xdescribe('Slack::', () => {
  it('Renders with props', () => {
    const root = mount(
      <Slack
        settings={{
          url: 'test',
        }}
        updateSettings={() => {}}
      />
    );

    expect(root.find(dataTestId('url-text-input')).prop('value')).toEqual('test');
  });

  it('Disables apply changes on initial values', () => {
    const root = mount(
      <Slack
        settings={{
          url: 'test',
        }}
        updateSettings={() => {}}
      />
    );
    const button = root.find('button');

    expect(button.prop('disabled')).toBeTruthy();
  });

  it('Calls apply changes', () => {
    const updateSettings = jest.fn();
    const root = mount(
      <Slack
        settings={{
          url: 'test',
        }}
        updateSettings={updateSettings}
      />
    );

    root.find(dataTestId('url-text-input')).simulate('change', { target: { value: 'new key' } });
    root.find('form').simulate('submit');

    expect(updateSettings).toHaveBeenCalled();
  });
});
