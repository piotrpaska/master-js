import AthletesTable from '@/components/startLineTablet/athletesTable/AthletesTable';
import StartRaceBtn from '@/components/startLineTablet/startRaceBtn/StartRaceBtn';
import TrackTimer from '@/components/trackTimer/TrackTimer';
import { useMasterSocket } from '@/hooks/MasterSocket';
import axiosInstance from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

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

export default function StartLineTablet(): React.JSX.Element {
  const { data: masterData, socket } = useMasterSocket();

  const unassignMutation = useMutation({
    mutationFn: async (trackId: string) => {
      await axiosInstance.put(`/track/${trackId}/unassign-entry`);
    },
    onSuccess: () => {
      // Optionally handle success, e.g., show a toast or refresh data
    },
    onError: (error) => {
      console.error('Error unassigning athlete:', error);
      // Optionally handle error, e.g., show a toast
    },
  });
  const [, setOrientation] = React.useState<'portrait' | 'landscape'>(
    window.innerWidth < window.innerHeight ? 'portrait' : 'landscape'
  );

  React.useEffect(() => {
    const handleResize = () => {
      setOrientation(
        window.innerWidth < window.innerHeight ? 'portrait' : 'landscape'
      );
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (width < height) {
    return (
      <div className="flex items-center justify-center h-svh">
        <p className="text-lg">Please rotate your device to landscape mode.</p>
      </div>
    );
  }

  if (socket?.disconnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Socket disconnected. Please reconnect.</p>
      </div>
    );
  }

  if (!masterData) {
    return <div>Loading...</div>;
  }

  const tracksPanels = () => {
    return masterData.tracks.map((track) => (
      <div key={track.id} className="flex flex-col w-full">
        <div
          className={`bg-gray-200 dark:bg-gray-800 p-8 mb-4 rounded flex items-center justify-between select-none gap-4 ${
            track.running ? 'bg-green-200 dark:bg-green-800' : ''
          }`}
          onPointerDown={(e) => {
            if (e.pointerType === 'touch' || e.pointerType === 'mouse') {
              e.persist?.();
              const target = e.currentTarget as HTMLDivElement;
              // Create overlay
              const overlay = document.createElement('div');
              overlay.style.position = 'absolute';
              overlay.style.top = '0';
              overlay.style.left = '0';
              overlay.style.width = '100%';
              overlay.style.height = '100%';
              overlay.style.pointerEvents = 'none';
              overlay.style.borderRadius =
                getComputedStyle(target).borderRadius;
              overlay.style.overflow = 'hidden';
              overlay.style.zIndex = '10';
              overlay.style.background =
                'radial-gradient(circle at 50% 50%, rgba(55,65,81,0.5) 0%, rgba(31,41,55,0.8) 100%)';
              overlay.style.opacity = '0';
              overlay.style.transition = 'opacity 0.6s linear';
              overlay.className = 'long-press-overlay';

              // Ensure parent is relative
              const prevPosition = target.style.position;
              if (getComputedStyle(target).position === 'static') {
                target.style.position = 'relative';
              }
              target.appendChild(overlay);

              // Animate overlay
              requestAnimationFrame(() => {
                overlay.style.opacity = '1';
              });

              const timeout = setTimeout(() => {
                // Handle long press here
                unassignMutation.mutate(track.id);
                cleanup();
              }, 600);

              function cleanup() {
                clearTimeout(timeout);
                overlay.style.opacity = '0';
                setTimeout(() => {
                  overlay.remove();
                  if (prevPosition === '') target.style.position = '';
                }, 200);
                window.removeEventListener('pointerup', cleanup);
                window.removeEventListener('pointerleave', cleanup);
              }

              window.addEventListener('pointerup', cleanup);
              window.addEventListener('pointerleave', cleanup);
            }
          }}
        >
          <h2 className="text-2xl font-semibold whitespace-nowrap">
            {track.name}
          </h2>
          <p
            className={
              'text-lg whitespace-nowrap border-2 p-2 rounded-lg shadow' +
              (track.entryId === null
                ? ' bg-red-500/20 border-red-500'
                : ' bg-green-300/20 border-green-500')
            }
          >
            {track.entry?.athlete.name || 'No active athlete'}
          </p>
          <div className="flex flex-col whitespace-nowrap">
            <div className="flex items-center gap-2">
              <TrackTimer
                track={track}
                className="text-gray-200 text-center text-3xl"
              />
            </div>

            <div className="text-xs text-muted-foreground">
              {track.prevDuration !== null
                ? `Last run: ${
                    masterData.activeStartList?.session?.records.find(
                      (record) => record.id === track.relatedLastRecordId
                    )?.entry.athlete.name || 'No last athlete'
                  } ${formatTime(track.prevDuration, false)} `
                : 'No previous run'}
            </div>
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          <AthletesTable trackId={track.id} />
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-svh max-h-svh">
      <div className="flex h-full overflow-x-scroll gap-2">
        {tracksPanels()}
      </div>

      <div className="mt-auto flex items-center justify-center w-full p-4 border-t">
        <StartRaceBtn />
      </div>
    </div>
  );
}
