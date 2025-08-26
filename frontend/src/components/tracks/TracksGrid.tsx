import { useMasterSocket } from '@/hooks/MasterSocket';
import { Track } from '@/interfaces/track';
import React, { useEffect } from 'react';
import ActionsModal from './ActionsModal';

export default function TrackGrid(): React.JSX.Element {
  const { data } = useMasterSocket();

  const tracks = data?.tracks;

  if (!tracks || tracks.length === 0) {
    return <div>No tracks available</div>;
  }

  return (
    <div className="flex flex-row items-center gap-4 my-4">
      {tracks.map((track) => (
        <TrackItem key={track.id} track={track} />
      ))}
    </div>
  );
}

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

function TrackItem({ track }: { track: Track }): React.JSX.Element {
  const [timeElapsed, setTimeElapsed] = React.useState<number>(0); // in milliseconds

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
      setTimeElapsed(track.prevDuration || 0); // reset when not running
      return undefined;
    }
  }, [track.running, track.prevDuration, track.elapsedTime]);

  return (
    <div className="border p-2 rounded shadow-sm text-xs w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-base font-semibold truncate">{track.name}</h2>
        <ActionsModal track={track} />
      </div>
      <p className="text-gray-200 truncate">ID: {track.id}</p>
      <p className="text-gray-200">
        <span className={track.running ? 'text-green-500' : 'text-red-500'}>
          {track.running ? 'Running' : 'Stopped'}
        </span>
      </p>
      <p className="text-gray-200 truncate">
        {track.entry?.athlete.name
          ? `Assigned: ${track.entry.athlete.name}`
          : 'No Entry'}
      </p>
      <p className="text-gray-200 text-center text-lg mt-1">
        {formatTime(timeElapsed, track.running)}
      </p>
    </div>
  );
}
