import React, { useEffect, useState, createContext, ReactChild, useContext } from 'react';
import { checkNotification } from './notifications';

const SOCKET_URL = `ws://${location.host}/v1/management/SecurityChecks/Stream`;
const webSocket = new WebSocket(SOCKET_URL);

export const SocketContext = createContext(webSocket);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const WebSocketProvider = ({ children }: { children: ReactChild }) => {
  const [ws, setWs] = useState<WebSocket>(webSocket);

  useEffect(() => {
    const onClose = () => {
      setTimeout(() => {
        setWs(new WebSocket(SOCKET_URL));
      }, 1000);
    };

    if (ws) {
      ws.onmessage = (event) => {
        if (event.data) {
          const data = JSON.parse(event.data);
          checkNotification(data);
        }
      };
    }

    ws.addEventListener('close', onClose);

    return () => {
      ws.removeEventListener('close', onClose);
    };
  }, [ws, setWs]);

  return <SocketContext.Provider value={ws}>{children}</SocketContext.Provider>;
};
