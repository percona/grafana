import { appEvents } from 'app/core/app_events';

export const showSuccessNotification = ({ message }) => {
  appEvents.emit('alert-success', [message]);
};

export const showWarningNotification = ({ message }) => {
  appEvents.emit('alert-warning', [message]);
};

export const showErrorNotification = ({ message }) => {
  appEvents.emit('alert-error', [message]);
};
