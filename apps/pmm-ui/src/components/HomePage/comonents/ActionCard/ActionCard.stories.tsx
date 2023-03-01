import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ActionCard } from './ActionCard';
import imgDbHealth from '../../assets/db-health.svg';

export default {
  title: 'Percona/ActionCard',
  component: ActionCard,
  argTypes: {
    text: {
      defaultValue: 'Action card #1',
    },
    imgSrc: {
      defaultValue: imgDbHealth,
    },
  },
} as ComponentMeta<typeof ActionCard>;

const Template: ComponentStory<typeof ActionCard> = (args) => {
  return <ActionCard {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
