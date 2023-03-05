import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ConnectedModal } from './ConnectedModal';
import { Button } from "@grafana/ui";

export default {
  title: 'Percona/Portal/Modals/ConnectedModal',
  component: ConnectedModal,
} as ComponentMeta<typeof ConnectedModal>;

const Template: ComponentStory<typeof ConnectedModal> = (args) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ConnectedModal onClose={() => setShowModal(false)} isOpen={showModal} />
      <Button onClick={() => setShowModal(true)}>
        Show modal
      </Button>
    </>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
