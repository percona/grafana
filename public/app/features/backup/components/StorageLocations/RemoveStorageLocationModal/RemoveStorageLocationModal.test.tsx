import React from 'react';
import { mount } from 'enzyme';
import { WarningBlock } from '../WarningBlock/WarningBlock';
import { RemoveStorageLocationModal } from './RemoveStorageLocationModal';

describe('RemoveStorageLocationModal', () => {
  it('should have a WarningBlock', () => {
    const wrapper = mount(
      <RemoveStorageLocationModal isVisible loading={false} setVisible={jest.fn()} onDelete={jest.fn()} />
    );
    expect(wrapper.find(WarningBlock).exists()).toBeTruthy();
  });
});
