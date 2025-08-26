import { Track } from '@/interfaces/track';
import { useEffect, useState } from 'react';

function formatTime(milliseconds: number, isRunning: boolean): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const ms = milliseconds % 1000;
  let displayMs = ms.toString().padStart(3, '0');
  if (isRunning) {
    displayMs = displayMs[0] + '00';
  }
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
    seconds < 10 ? '0' : ''
  }${seconds}.${displayMs}`;
}

export default function TrackTimer({
  track,
  className,
}: {
  track: Track;
  className?: string;
}): React.JSX.Element {
  const [timeElapsed, setTimeElapsed] = useState<number>(0); // in milliseconds

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (track.running) {
      if (!interval) {
        setTimeElapsed(track.elapsedTime || 0);

        interval = setInterval(() => {
          setTimeElapsed((prev) => prev + 100); // increment every 100 milliseconds
        }, 100);
      }

      return () => clearInterval(interval);
    } else {
      setTimeElapsed(0);
      return undefined;
    }
  }, [track.running, track.prevDuration, track.elapsedTime]);

  return <p className={className}>{formatTime(timeElapsed, track.running)}</p>;
}
