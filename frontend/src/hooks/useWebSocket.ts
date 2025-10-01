import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080', {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      setError(err.message);
      setIsConnected(false);
    });

    socket.on('message', (message: WebSocketMessage) => {
      setLastMessage(message);
    });

    socket.on('transaction_update', (data) => {
      setLastMessage({
        type: 'transaction_update',
        data,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('system_alert', (data) => {
      setLastMessage({
        type: 'system_alert',
        data,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('fraud_alert', (data) => {
      setLastMessage({
        type: 'fraud_alert',
        data,
        timestamp: new Date().toISOString(),
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (type: string, data: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('message', { type, data });
    }
  };

  const subscribe = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const unsubscribe = (event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback);
      } else {
        socketRef.current.off(event);
      }
    }
  };

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    subscribe,
    unsubscribe,
  };
}
