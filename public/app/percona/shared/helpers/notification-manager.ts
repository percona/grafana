import { appEvents } from 'app/core/app_events';

interface Message {
  message: string;
}

export const showSuccessNotification = ({ message }: Message) => {
  appEvents.emit('alert-success', [message]);
};

export const showWarningNotification = ({ message }: Message) => {
  appEvents.emit('alert-warning', [message]);
};

export const showErrorNotification = ({ message }: Message) => {
  appEvents.emit('alert-error', [message]);
};
