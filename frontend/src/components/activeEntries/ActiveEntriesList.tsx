import { useMasterSocket } from '@/hooks/MasterSocket';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import {
  IconLink,
  IconLoader2,
  IconRestore,
  IconSearch,
} from '@tabler/icons-react';
import { Badge } from '../ui/badge';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function ActiveEntriesList(): React.JSX.Element {
  const { data } = useMasterSocket();

  const activeEntries = data?.activeStartList?.entries || null;

  const assignMutation = useMutation({
    mutationFn: async ({
      entryId,
      trackId,
    }: {
      entryId: string | null;
      trackId: string;
    }) => {
      await axiosInstance.put(
        entryId
          ? `/track/${trackId}/assign-entry/${entryId}`
          : `/track/${trackId}/unassign-entry`,
        {
          entryId: entryId,
        }
      );
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error assigning entry:', error);
      toast.error(
        `Failed to assign entry: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (entryId: string) => {
      await axiosInstance.put(`/entry/${entryId}/restore`);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error restoring entry:', error);
      toast.error(
        `Failed to restore entry: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const restoreStartListMutation = useMutation({
    mutationFn: async (startListId: string) => {
      await axiosInstance.put(`/entry/restore-start-list/${startListId}`);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error restoring start list:', error);
      toast.error(
        `Failed to restore start list: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  if (activeEntries === null) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
        <IconSearch className="mb-2 size-8 opacity-50" />
        <span className="font-semibold text-base">No active start list</span>
        <span className="text-xs mt-1">
          Please select or create a start list to view active entries.
        </span>
      </div>
    );
  }

  return (
    <div className="p-2 text-xs relative">
      {activeEntries.length > 0 ? (
        activeEntries.map((entry, index) => (
          <div key={entry.id} className="mb-2">
            <div
              className={
                'flex items-center gap-2' +
                (entry.alreadyStarted ? ' text-muted-foreground' : '')
              }
            >
              <span className="font-semibold mr-2">{index + 1}</span>
              <div className="flex w-full justify-between flex-row items-center mt-1">
                <span className="flex-1">{entry.athlete.name}</span>

                <div className="flex items-center flex-wrap justify-center flex-1 relative">
                  {data?.tracks.map((track) => (
                    <Badge
                      key={track.id}
                      className={
                        'mr-1 cursor-pointer hover:bg-gray-600' +
                        (!entry.alreadyStarted
                          ? ''
                          : ' opacity-50 pointer-events-none')
                      }
                      variant={
                        entry.id === track.entryId ? 'default' : 'outline'
                      }
                      role="button"
                      aria-disabled={!entry.alreadyStarted}
                      onClick={() => {
                        if (entry.alreadyStarted) return;
                        if (entry.id === track.entryId) {
                          assignMutation.mutate({
                            entryId: null,
                            trackId: track.id,
                          });
                        } else {
                          assignMutation.mutate({
                            entryId: entry.id,
                            trackId: track.id,
                          });
                        }
                      }}
                    >
                      {track.name}
                    </Badge>
                  ))}
                  {entry.alreadyStarted && (
                    <div className="absolute inset-0 bg-black/70 z-10 rounded ">
                      <span
                        className="text-red-500 text-xs font-semibold absolute inset-0 flex
                        justify-center items-center"
                      >
                        Already Started
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-cyan-500 hover:text-cyan-400 disabled:text-muted-foreground"
                  onClick={() => {
                    if (!entry.id) return;
                    restoreMutation.mutate(entry.id);
                  }}
                  disabled={!entry.alreadyStarted}
                >
                  <IconRestore className="size-4" />
                </Button>
              </div>
            </div>

            <Separator className="mb-1" />
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <IconLink className="mb-2 size-8 opacity-50" />
          <p className="text-center text-muted-foreground font-semibold">
            No active entries
          </p>
          <span className="text-xs mt-1 text-muted-foreground">
            All entries have either started or none are available in the current
            start list.
          </span>
        </div>
      )}

      {(data?.activeStartList?.entries?.length ?? 0) > 0 && (
        <div className="mt-4 w-full flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              if (!data?.activeStartList?.id) return;
              restoreStartListMutation.mutate(data.activeStartList.id);
            }}
            disabled={restoreStartListMutation.isPending}
          >
            {restoreStartListMutation.isPending ? (
              <IconLoader2 className="animate-spin" />
            ) : (
              <IconRestore className="size-4" />
            )}
            {restoreStartListMutation.isPending
              ? 'Restoring...'
              : 'Restore Start List'}
          </Button>
        </div>
      )}

      {restoreStartListMutation.isPending ||
      restoreMutation.isPending ||
      assignMutation.isPending ? (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <IconLoader2 className="size-6 animate-spin text-white" />
        </div>
      ) : null}
    </div>
  );
}
