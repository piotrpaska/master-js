import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { io } from 'socket.io-client';
import axiosInstance from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function CountdownPanel(): React.JSX.Element {
  const [countdown, setCountdown] = useState<number>(0);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_MASTER_COUNTDOWN_SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 5000,
    });

    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socket.on('countdown', (time: number) => {
      setCountdown(time);
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const startCountdownMutation = useMutation({
    mutationFn: () => axiosInstance.post('/start-seq/start'),
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data.message || 'Failed to start countdown');
    },
  });

  const stopCountdownMutation = useMutation({
    mutationFn: () => axiosInstance.post('/start-seq/stop'),
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data.message || 'Failed to stop countdown');
    },
  });

  const startCountdown = (): void => {
    startCountdownMutation.mutate();
  };

  const stopCountdown = (): void => {
    stopCountdownMutation.mutate();
  };

  return (
    <div className="p-4 rounded shadow flex flex-row items-center">
      <div>
        <h2>Countdown Timer</h2>
        <div>Time remaining: {countdown}</div>
      </div>
      {connected ? (
        countdown > 0 ? (
          <Button
            onClick={stopCountdown}
            loading={stopCountdownMutation.isPending}
            className="ml-4 bg-red-500 text-white hover:bg-red-600"
          >
            Stop Countdown
          </Button>
        ) : (
          <Button
            onClick={startCountdown}
            loading={startCountdownMutation.isPending}
            className="ml-4 bg-green-500 text-white hover:bg-green-600"
          >
            Start Countdown
          </Button>
        )
      ) : (
        <Button disabled className="ml-4 bg-gray-500 text-white">
          Socket Not Connected
        </Button>
      )}
    </div>
  );
}
