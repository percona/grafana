import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Tip } from './Tip';

export default {
  title: 'Percona/HelpCenter/Tip',
  component: Tip,
  argTypes: {},
} as ComponentMeta<typeof Tip>;

const Template: ComponentStory<typeof Tip> = (args) => {
  return <Tip {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  number: 1,
  title: 'Check new advisors',
  tipText: 'You now have access to more Advisors to automatically check your system health.',
  buttonText: 'Check new advisors',
  buttonIcon: 'external-link-alt',
  completed: false,
  opened: true,
};

export const Completed = Template.bind({});
Completed.args = {
  number: 1,
  title: 'Check new advisors',
  tipText: 'You now have access to more Advisors to automatically check your system health.',
  buttonText: 'Check new advisors',
  buttonIcon: 'external-link-alt',
  completed: true,
};

export const Collapsed = Template.bind({});
Collapsed.args = {
  number: 1,
  title: 'Check new advisors',
  tipText: 'You now have access to more Advisors to automatically check your system health.',
  buttonText: 'Check new advisors',
  buttonIcon: 'external-link-alt',
  opened: false,
};
