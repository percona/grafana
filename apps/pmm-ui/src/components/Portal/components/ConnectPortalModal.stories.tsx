import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ConnectPortalModal } from './ConnectPortalModal';
import { Button } from "@grafana/ui";

export default {
  title: 'Percona/Portal/Modals/ConnectPortalModal',
  component: ConnectPortalModal,
  argTypes: {
    text: { type: 'string' },
  },
} as ComponentMeta<typeof ConnectPortalModal>;

const Template: ComponentStory<typeof ConnectPortalModal> = (args) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ConnectPortalModal onClose={() => setShowModal(false)} isOpen={showModal} isAdmin={args.isAdmin}/>
      <Button onClick={() => setShowModal(true)}>
        Show modal
      </Button>
    </>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
