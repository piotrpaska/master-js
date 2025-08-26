import Athlete from '@/interfaces/athlete';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '../dataTable/DataTable';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const columns: ColumnDef<Athlete>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomeRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
          {column.getIsSorted() === 'asc' ? ' (ascending)' : ' (descending)'}
        </Button>
      );
    },
    enableSorting: true,
  },
];

export default function AthletesTable({
  athletes,
}: {
  athletes: Athlete[];
}): React.JSX.Element {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (athleteIds: string[]) => {
      console.log('Deleting athletes:', athleteIds);
      for (const id of athleteIds) {
        await axiosInstance.delete(`/athlete/${id}`);
      }

      return queryClient.invalidateQueries({ queryKey: ['athletes'] });
    },
    onSuccess: () => {
      setRowSelection({});
      toast.success('Selected athletes deleted successfully');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Error deleting athletes:', error);
      toast.error(
        `Failed to delete selected athletes: ${
          error.response?.data.message || error.message
        }`
      );
    },
  });

  const getSelectedAthleteIds = (): string[] => {
    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((index) => athletes[parseInt(index)].id);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={athletes}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />

      <Button
        disabled={Object.values(rowSelection).every((selected) => !selected)}
        onClick={() => deleteMutation.mutate(getSelectedAthleteIds())}
        className="my-4"
        variant="destructive"
        loading={deleteMutation.isPending}
      >
        Delete selected athletes
      </Button>
    </>
  );
}
