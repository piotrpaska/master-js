import Athlete from '@/interfaces/athlete';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { IconLoader2, IconPlus } from '@tabler/icons-react';
import DataTable from '../dataTable/DataTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Entry from '@/interfaces/entry';
import StartList from '@/interfaces/startList';
import axiosInstance from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';

export default function AthletesTable({
  startList,
}: {
  startList: StartList & { entries: (Entry & { athlete: Athlete })[] };
}): React.JSX.Element {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['athletes'],
    queryFn: async () => {
      const response = await axiosInstance.get('/athlete');
      return response.data as Athlete[];
    },
  });

  const addEntryMutation = useMutation({
    mutationFn: async (athleteId: string) => {
      const response = await axiosInstance.post('/entry', {
        athleteId,
        startListId: startList.id,
        bib: (Math.floor(Math.random() * 100) + 1).toString(),
        alreadyStarted: false,
      });
      return response.data;
    },
    onSuccess: () => {
      console.log('Entry added successfully');
      queryClient.invalidateQueries({ queryKey: ['selectedStartList'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Error adding entry:', error);
      toast.error(
        `Failed to add entry: ${error.response?.data.message || error.message}`
      );
    },
  });

  const athletesColumns: ColumnDef<Athlete>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      id: 'add',
      cell: ({ row }) => (
        <Button
          size="icon"
          onClick={() => addEntryMutation.mutate(row.original.id)}
          disabled={startList.entries.some(
            (entry) => entry.athlete.id === row.original.id
          )}
        >
          <IconPlus className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full overflow-auto">
        <IconLoader2 className="animate-spin" />
        <span>Loading athletes...</span>
      </div>
    );
  }

  return (
    <>
      <DataTable data={data || []} columns={athletesColumns} />
      {addEntryMutation.isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 opacity-75">
          <Loader2 className="animate-spin size-12 text-gray-500" />
          <span className="text-gray-500">Adding entry...</span>
        </div>
      )}
    </>
  );
}
