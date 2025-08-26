import { Device } from '@/interfaces/device';
import { Track } from '@/interfaces/track';
import { MasterSocketContext } from '@/hooks/MasterSocket';
import React from 'react';
import { Socket, io } from 'socket.io-client';
import ActiveStartList from '@/interfaces/activeStartList';

export interface MasterSocketData {
  devices: Device[];
  tracks: Track[];
  activeStartList: ActiveStartList | null;
}

export interface MasterSocketContextType {
  socket: Socket | null;
  data: MasterSocketData | null;
  sendMessage: (event: string, data?: unknown) => void;
  disconnect: () => void;
  reconnect: () => void;
}

interface MasterSocketProviderProps {
  children: React.ReactNode;
}

export const MasterSocketProvider: React.FC<MasterSocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [data, setData] = React.useState<MasterSocketData | null>(null);

  React.useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_MASTER_API_SOCKET_URL, // Use this for Vite
      // process.env.REACT_APP_MASTER_API_SOCKET_URL, // Uncomment this line and comment the above if using Create React App
      {
        transports: ['websocket'],
        autoConnect: false,
        reconnection: true,
        reconnectionDelay: 5000,
      }
    );

    newSocket.on('connect', () => {
      console.log('Connected to master socket');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from master socket');
      setData(null);
    });

    newSocket.on('data', (newData: MasterSocketData) => {
      setData({
        devices: newData.devices || [],
        tracks: newData.tracks || [],
        activeStartList: newData.activeStartList || null,
      });
      console.log('Received data from master socket:', newData);
    });

    setSocket(newSocket);
    newSocket.connect();

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = (event: string, data?: unknown): void => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  const disconnect = (): void => {
    if (socket) {
      socket.disconnect();
    }
  };

  const reconnect = (): void => {
    if (socket) {
      socket.connect();
    }
  };

  return (
    <MasterSocketContext.Provider
      value={{ socket, data, sendMessage, disconnect, reconnect }}
    >
      {children}
    </MasterSocketContext.Provider>
  );
};
