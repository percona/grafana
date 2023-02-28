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
  return (
    <>
      <TopBar
        title="Percona monitoring and management"
        userContext={userContext}
        showSignIn
        showFeedbackButton
        showHelpCenterButton
        showHelpCenterNotificationMarker
        onSignInClick={() => {
          setMessage('sign in');
          setUserContext('something_here');
        }}
        onHelpCenterClick={() => setMessage('help center')}
        onNotificationClick={() => setMessage('notification')}
        onFeedbackClick={() => setMessage('feedback form')}
      />
      <p>{message}</p>
    </>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
