import AthletesTable from './AthletesTable';
import DataTable from '../dataTable/DataTable';
import { Button } from '../ui/button';
import { IconRowRemove } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/api';
import { Separator } from '../ui/separator';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import DetailedStartList from '@/interfaces/detailedStartList';
import Entry from '@/interfaces/entry';

export default function EditEntries({
  startList,
}: {
  startList: DetailedStartList;
}): React.JSX.Element {
  const queryClient = useQueryClient();

  const removeEntryMutation = useMutation({
    mutationFn: async (athleteId: string) => {
      const response = await axiosInstance.delete(`/entry/${athleteId}`);
      return response.data;
    },
    onSuccess: () => {
      console.log('Entry removed successfully');
      queryClient.invalidateQueries({ queryKey: ['selectedStartList'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Error removing entry:', error);
      toast.error(
        `Failed to remove entry: ${
          error.response?.data.message || error.message
        }`
      );
    },
  });

  const athletesColumns: ColumnDef<Entry>[] = [
    {
      id: 'name',
      accessorKey: 'athlete.name',
      header: 'Name',
    },
    {
      accessorKey: 'alreadyStarted',
      header: 'Has Started?',
      cell: ({ row }) => (
        <span
          className={
            row.original.alreadyStarted ? 'text-green-500' : 'text-red-500'
          }
        >
          {row.original.alreadyStarted ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      id: 'remove',
      cell: ({ row }) => (
        <Button
          size="icon"
          onClick={() => removeEntryMutation.mutate(row.original.id)}
        >
          <IconRowRemove className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="mt-4 relative">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-2">Athletes</h2>
          <AthletesTable startList={startList} />
        </div>
        <Separator className="md:hidden" />
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-2">Entries</h2>
          <DataTable data={startList.entries} columns={athletesColumns} />
        </div>
      </div>

      {removeEntryMutation.isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 opacity-75">
          <Loader2 className="animate-spin size-12 text-gray-500" />
          <span className="text-gray-500">Removing entry...</span>
        </div>
      )}
    </div>
  );
}
