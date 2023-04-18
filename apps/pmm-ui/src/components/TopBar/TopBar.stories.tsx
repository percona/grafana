import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { TopBar } from './TopBar';

export default {
  title: 'Percona/TopBar',
  component: TopBar,
  argTypes: {
    text: { type: 'string' },
  },
} as ComponentMeta<typeof TopBar>;

const Template: ComponentStory<typeof TopBar> = (args) => {
  const [message, setMessage] = useState('');
  const [userContext, setUserContext] = useState('');
  const [visibleFeedback, setVisibleFeedback] = useState(false);

  return (
    <>
      <TopBar
        showFeedbackButton
        showHelpCenterButton
        onSignInClick={() => {
          setMessage('sign in');
          setUserContext('something_here');
        }}
        onHelpCenterClick={() => setMessage('help center')}
        onCloseHelpCenterTooltip={() => setMessage('close tooltip')}
        visibleFeedback={visibleFeedback}
        setVisibleFeedback={setVisibleFeedback}
      />
      <p>{message}</p>
    </>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
