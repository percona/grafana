export enum MessageType {
  NAVIGATE_TO = 'NAVIGATE_TO',
  LOCATION_CHANGE = 'LOCATION_CHANGE',
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
