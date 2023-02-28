import React, { useState, FC } from 'react';
import { TopBar } from '../components';

export const OnboardPanel: FC<{}> = () => {
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
      <br />
      <div>{message}</div>
    </>
  );
};
