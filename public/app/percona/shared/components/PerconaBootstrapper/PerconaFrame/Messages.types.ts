export enum MessageType {
  MESSENGER_READY = 'MESSENGER_READY',
  NAVIGATE_TO = 'NAVIGATE_TO',
  LOCATION_CHANGE = 'LOCATION_CHANGE',
  LINK_VARIABLES = 'LINK_VARIABLES',
  LINK_VARIABLES_RESULT = 'LINK_VARIABLES_RESULT',
}

export interface Message<T = any> {
  type: MessageType;
  data: T;
}

export interface MessageListener {
  type: string;
  onMessage: (message: Message<any>) => void;
}

export type NavigateToMessage = Message<{
  to: string;
}>;

export type LinkVariablesMessage = Message<{
  id: string;
  url: string;
}>;
