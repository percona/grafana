import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { TipNotConnected } from './TipNotConnected';

export default {
  title: 'Percona/HelpCenter/TipsContainer',
  component: TipNotConnected,
  argTypes: {},
} as ComponentMeta<typeof TipNotConnected>;

const Template: ComponentStory<typeof TipNotConnected> = (args) => {
  return <TipNotConnected {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
