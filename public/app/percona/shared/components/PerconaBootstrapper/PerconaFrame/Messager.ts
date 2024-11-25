import { Message, MessageListener } from './Messages.types';

class Messager {
  listeners: MessageListener[] = [];

  addListener(listener: MessageListener) {
    this.listeners.push(listener);
    console.log(this.listeners);
  }

  onMessageReceived(e: MessageEvent) {
    console.log(e);
    console.log(this.listeners);

    this.listeners.forEach((listener) => {
      if (e.data?.type === listener.type) {
        listener.onMessage(e.data);
      }
    });
  }

  sendMessage<T = any>(message: Message<T>) {
    window.top?.postMessage(message);
  }

  register() {
    window.addEventListener('message', (e) => this.onMessageReceived(e));
  }

  unregister() {
    this.listeners = [];
    window.removeEventListener('message', (e) => this.onMessageReceived(e));
  }
}

const messager = new Messager();

export default messager;
