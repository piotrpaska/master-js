import { useMasterSocket } from '@/hooks/MasterSocket';
import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from '../ui/table';

import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/api';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, ArrowUpDown, Trash } from 'lucide-react';
import Record from '@/interfaces/record';
import Athlete from '@/interfaces/athlete';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import DetailedStartList from '@/interfaces/detailedStartList';
import { formatTime } from '@/lib/utils';
import Entry from '@/interfaces/entry';

export default function RecordsTable({
  startList,
}: {
  startList: DetailedStartList;
}): React.JSX.Element {
  const queryClient = useQueryClient();

  const [selectedSession, setSelectedSession] = React.useState<string | null>(
    startList.sessions && startList.sessions.length > 0
      ? startList.sessions[0].id
      : null
  );

  const [textInput, setTextInput] = React.useState<string>('');

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/record/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selectedStartList'] });
      toast.success('Record deleted successfully');
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/session/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selectedStartList'] });
      toast.success('Session deleted successfully');
    },
  });

  const newSessionMutation = useMutation({
    mutationFn: async (title: string) => {
      await axiosInstance.post('/session', {
        title,
        startListId: startList.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selectedStartList'] });
      toast.success('Session created successfully');
      setTextInput('');
    },
  });

  const columns: ColumnDef<Record & { entry: Entry & { athlete: Athlete } }>[] =
    [
      {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className={
              column.getIsSorted() === 'asc' || column.getIsSorted() === 'desc'
                ? 'text-blue-500'
                : undefined
            }
          >
            Rank
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        id: 'rank',
        cell: ({ row }) => {
          const rank = row.index + 1;
          return Number(rank);
        },
        sortingFn: (a, b) => {
          const aDuration = a.original.duration;
          const bDuration = b.original.duration;
          if (aDuration === null) return 1;
          if (bDuration === null) return -1;
          return Number(aDuration) - Number(bDuration);
        },
      },
      {
        accessorKey: 'entry.athlete.name',
        header: 'Athlete Name',
      },
      {
        accessorKey: 'entry.bib',
        header: 'BIB',
      },
      {
        accessorKey: 'duration',
        header: 'Time',
        cell: ({ row }) => {
          const duration = row.getValue('duration');
          return <span>{formatTime(Number(duration ?? 0), false)}</span>;
        },
      },
      {
        accessorKey: 'track',
        header: 'Track',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'timestamp',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className={
              column.getIsSorted() === 'asc' || column.getIsSorted() === 'desc'
                ? 'text-blue-500'
                : undefined
            }
          >
            Timestamp
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-1 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          return (
            <span>{new Date(row.original.timestamp).toLocaleString()}</span>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => deleteMutation.mutate(row.original.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ];

  const { data } = useMasterSocket();

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'rank', desc: true },
  ]);

  const filteredRecords = React.useMemo(() => {
    if (!selectedSession) {
      return startList.sessions?.flatMap((session) => session.records) ?? [];
    }
    const session = startList.sessions?.find(
      (session) => session.id === selectedSession
    );
    return session?.records ?? [];
  }, [selectedSession, startList.sessions]);

  const table = useReactTable({
    data: filteredRecords,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor="session-select">Session:</Label>
          <Select
            value={selectedSession || undefined}
            onValueChange={setSelectedSession}
          >
            <SelectTrigger id="session-select">
              <SelectValue placeholder="Select session" />
            </SelectTrigger>
            <SelectContent>
              {startList.sessions?.map((session) => (
                <SelectItem key={session.id} value={session.id}>
                  {session.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <p className="text-sm">
                Are you sure you want to delete this session?
              </p>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedSession) {
                      deleteSessionMutation.mutate(selectedSession);
                      setSelectedSession(null);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-end justify-center gap-2">
          <div>
            <Label htmlFor="search-input" className="mb-1">
              Search:
            </Label>
            <Input
              id="add-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter session title..."
            />
          </div>

          <Button
            variant="outline"
            onClick={() => {
              if (textInput || textInput.length > 0) {
                newSessionMutation.mutate(textInput);
              } else {
                toast.warning('Session title cannot be empty');
              }
            }}
            loading={newSessionMutation.isPending}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="rounded-md border relative mt-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={
                    data?.tracks?.some(
                      (track) => track.relatedLastRecordId === row.original.id
                    )
                      ? 'animate-yellow-fade'
                      : ''
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No records.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {deleteMutation.isPending && (
          <div className="absolute inset-0 bg-black opacity-50" />
        )}
      </div>
    </div>
  );
}
