import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ActionCard, ActionCardVariant } from './ActionCard';
import img3dStar from '../../assets/3d-star.png';

export default {
  title: 'Percona/ActionCard',
  component: ActionCard,
  argTypes: {
    variant: {
      defaultValue: 'Primary',
      options: Object.values(ActionCardVariant).filter((x) => typeof x === 'string'),
      mapping: ActionCardVariant,
      control: {
        type: 'select',
      },
    },
    heading: {
      defaultValue: 'Heading',
    },
    description: {
      defaultValue: 'Action card description',
    },
    imgSrc: {
      defaultValue: img3dStar,
    },
  },
} as ComponentMeta<typeof ActionCard>;

const Template: ComponentStory<typeof ActionCard> = (args) => {
  return <ActionCard {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
