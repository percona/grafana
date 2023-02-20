import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { HelpCenter } from './HelpCenter';

export default {
  title: 'Percona/HelpCenter',
  component: HelpCenter,
  argTypes: {},
} as ComponentMeta<typeof HelpCenter>;

const Template: ComponentStory<typeof HelpCenter> = (args) => {
  return <HelpCenter {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
