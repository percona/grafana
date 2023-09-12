import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { HomePage } from './HomePage';

export default {
  title: 'Percona/HomePage',
  component: HomePage,
  argTypes: {},
} as ComponentMeta<typeof HomePage>;

const Template: ComponentStory<typeof HomePage> = (args) => {
  return <HomePage {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
