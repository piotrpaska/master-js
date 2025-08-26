import { useMasterSocket } from '@/hooks/MasterSocket';
import axiosInstance from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const selectedClassName = 'bg-gray-100 dark:bg-gray-700';
const disabledClassName = 'opacity-40 cursor-not-allowed';

export default function AthletesTable({
  trackId,
}: {
  trackId: string;
}): React.JSX.Element {
  const { data } = useMasterSocket();

  const selectMutation = useMutation({
    mutationFn: async (athleteId: string) => {
      await axiosInstance.put(`/track/${trackId}/assign-entry/${athleteId}`, {
        athleteId,
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Error assigning athlete:', error);
      toast.error(error.response?.data.message || 'Error assigning athlete');
    },
  });

  const entries = data?.activeStartList?.entries || [];

  if (!entries || entries.length === 0) {
    return (
      <div className="p-4 text-center">
        No athletes available for this track.
      </div>
    );
  }

  return (
    <ul className="relative">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className={
            ' border-b p-4 hover:bg-gray-100 dark:hover:bg-gray-900 ' +
            (entry.alreadyStarted
              ? disabledClassName
              : entry.id ===
                data?.tracks.find((track) => track.id === trackId)?.entryId
              ? selectedClassName
              : '')
          }
          onClick={() => {
            if (!entry.alreadyStarted) {
              selectMutation.mutate(entry.id);
            }
          }}
        >
          <p className="font-medium">{entry.athlete.name}</p>
          {entry.alreadyStarted && (
            <div className="text-sm text-cyan-500 opacity-100">
              Already Started
            </div>
          )}
        </li>
      ))}

      {selectMutation.isPending && (
        <li className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 opacity-75">
          <Loader2 className="animate-spin size-12 text-gray-500" />
        </li>
      )}
    </ul>
  );
}
