import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ConfirmEmailModal } from './ConfirmEmailModal';
import { Button } from '@grafana/ui';

export default {
  title: 'Percona/Portal/Modals/ConfirmEmailModal',
  component: ConfirmEmailModal,
} as ComponentMeta<typeof ConfirmEmailModal>;

const Template: ComponentStory<typeof ConfirmEmailModal> = (args) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ConfirmEmailModal onClose={() => setShowModal(false)} isOpen={showModal} />
      <Button onClick={() => setShowModal(true)}>Show modal</Button>
    </>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
