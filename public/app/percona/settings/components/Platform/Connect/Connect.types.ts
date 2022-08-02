import { ConnectRenderProps } from '../types';

export interface ConnectProps {
  onConnect: (values: ConnectRenderProps) => void;
  connecting: boolean;
  initialValues: ConnectRenderProps;
}
