// @ts-nocheck
// import AppEvents from 'grafana/app/core/app_events';

export const showSuccessNotification = ({ message }) => {
  console.log(message);
  // AppEvents.emit('alert-success', [message]);
};

export const showWarningNotification = ({ message }) => {
  console.log(message);

  // AppEvents.emit('alert-warning', [message]);
};

export const showErrorNotification = ({ message }) => {
  console.log(message);

  // AppEvents.emit('alert-error', [message]);
};
