import React, { createContext, ReactChild, useContext, useEffect, useState } from 'react';
import { checkNotification } from './notifications';

const SocketContext = createContext<WebSocket>(null!);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const WebSocketProvider = ({ children }: { children: ReactChild }) => {
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(`ws://${location.host}/v1/management/SecurityChecks/Stream`);
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  if (socket) {
    socket.onmessage = (event) => {
      if (event.data) {
        const data = JSON.parse(event.data);
        checkNotification(data);
      }
    };
  }

  return <SocketContext.Provider value={socket!}>{children}</SocketContext.Provider>;
};
