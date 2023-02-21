import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { TipsContainer } from './TipsContainer';

export default {
  title: 'Percona/HelpCenter/TipsContainer',
  component: TipsContainer,
  argTypes: {},
} as ComponentMeta<typeof TipsContainer>;

const Template: ComponentStory<typeof TipsContainer> = (args) => {
  return <TipsContainer {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
