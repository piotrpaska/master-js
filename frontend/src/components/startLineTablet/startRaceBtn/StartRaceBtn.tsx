import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function StartRaceBtn() {
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
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Error starting countdown:', error);
      toast.error(error.response?.data.message || 'Error starting countdown');
    },
  });

  const stopCountdownMutation = useMutation({
    mutationFn: () => axiosInstance.post('/start-seq/stop'),
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Error stopping countdown:', error);
      toast.error(error.response?.data.message || 'Error stopping countdown');
    },
  });

  const startCountdown = (): void => {
    startCountdownMutation.mutate();
  };

  const stopCountdown = (): void => {
    stopCountdownMutation.mutate();
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center w-full">
        <Button
          variant="secondary"
          size="lg"
          className="w-1/2 text-2xl bg-gray-500 hover:bg-gray-600"
          disabled
        >
          Connecting...
        </Button>
      </div>
    );
  }

  if (countdown > 0) {
    return (
      <div className="flex items-center justify-center w-full">
        <Button
          onClick={stopCountdown}
          size="lg"
          className="bg-red-600 text-white hover:bg-red-800 w-3/8 text-5xl h-24"
          loading={stopCountdownMutation.isPending}
        >
          Stop Countdown
        </Button>
        <div className="ml-4 text-lg">Time remaining: {countdown}</div>
      </div>
    );
  }

  return (
    <Button
      variant="secondary"
      size="lg"
      className="w-1/2 text-5xl h-24 bg-green-500 hover:bg-green-600"
      onClick={startCountdown}
      loading={startCountdownMutation.isPending}
    >
      Start Race
    </Button>
  );
}
