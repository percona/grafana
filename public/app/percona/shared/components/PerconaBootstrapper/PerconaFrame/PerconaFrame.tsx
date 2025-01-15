import { FC, useEffect } from 'react';
import { useLocation } from 'react-router';

import { locationService } from '@grafana/runtime';

import messager from './Messager';
import { MessageType, NavigateToMessage } from './Messages.types';

export const PerconaFrame: FC = () => {
  const location = useLocation();

  const onNavigate = (message: NavigateToMessage) => {
    console.log('onNavigate', message);
    locationService.push(message.data.to.replace('/graph', ''));
  };

  useEffect(() => {
    messager.register();

    messager.addListener({
      type: MessageType.NAVIGATE_TO,
      onMessage: onNavigate,
    });

    return () => {
      messager.unregister();
    };
  }, []);

  useEffect(() => {
    messager.sendMessage({
      type: MessageType.LOCATION_CHANGE,
      data: {
        location,
      },
    });
  }, [location]);

  return null;
};
