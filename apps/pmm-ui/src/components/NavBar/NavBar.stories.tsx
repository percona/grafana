import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { NavBar } from './NavBar';

export default {
  title: 'Percona/NavBar',
  component: NavBar,
  argTypes: {
    text: { type: 'string' },
  },
} as ComponentMeta<typeof NavBar>;

const Template: ComponentStory<typeof NavBar> = (args) => {
  const [message, setMessage] = useState('');
  const [userContext, setUserContext] = useState('');
  console.log(args);
  return (
    <>
      <NavBar
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
