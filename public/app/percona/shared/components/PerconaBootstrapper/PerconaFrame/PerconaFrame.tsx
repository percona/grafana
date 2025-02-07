import { FC } from 'react';
// import { useLocation } from 'react-router';

// import { locationService } from '@grafana/runtime';
// import { getLinkWithVariables } from 'app/percona/shared/helpers/navigation';

// import messager from './Messager';
// import { LinkVariablesMessage, MessageType, NavigateToMessage } from './Messages.types';

export const PerconaFrame: FC = () => {
  // const location = useLocation();

  // const onNavigate = (message: NavigateToMessage) => {
  //   console.log('onNavigate', message);
  //   locationService.push(message.data.to.replace('/graph', ''));
  // };

  // const onLinkVariables = (message: LinkVariablesMessage) => {
  //   console.log('onLinkVariables', message);

  //   if (message.data.url) {
  //     const url = getLinkWithVariables(message.data.url);

  //     messager.sendMessage({
  //       type: MessageType.LINK_VARIABLES,
  //       data: {
  //         id: message.data.id,
  //         url,
  //       },
  //     });
  //   }
  // };

  // // useEffect(() => {
  //   // messager.register();

  //   // messager.addListener({
  //   //   type: MessageType.NAVIGATE_TO,
  //   //   onMessage: onNavigate,
  //   // });

  //   // messager.addListener({
  //   //   type: MessageType.LINK_VARIABLES,
  //   //   onMessage: onLinkVariables,
  //   // });

  //   // return () => {
  //   //   messager.unregister();
  //   // };
  // // }, []);

  // useEffect(() => {
  //   messager.sendMessage({
  //     type: MessageType.LOCATION_CHANGE,
  //     data: {
  //       location,
  //     },
  //   });
  // }, [location]);

  return null;
};
