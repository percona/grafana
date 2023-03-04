import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Resource } from './Resource';

export default {
  title: 'Percona/HelpCenter/Resource',
  component: Resource,
  argTypes: {},
} as ComponentMeta<typeof Resource>;

const Template = args => {
  return (
    <Resource {...args}/>
  )
}

export const Primary = Template.bind({});
Primary.args = {
  icon: "book-open",
  title: "Documentation",
  text: "Visit out up-to-date, detailed guides on how to use PMM effectively.",
  url: "https://docs.percona.com/percona-monitoring-and-management/index.html",
  buttonText: "Open documentation",
};
