import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { PerconaUpgradeLevel } from './PerconaUpgradeLevel';

export default {
  title: 'Percona/HelpCenter/PerconaUpgradeLevel',
  component: PerconaUpgradeLevel,
  argTypes: {},
} as ComponentMeta<typeof PerconaUpgradeLevel>;


const Template: ComponentStory<typeof PerconaUpgradeLevel> = (args) => {
  return <PerconaUpgradeLevel {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
