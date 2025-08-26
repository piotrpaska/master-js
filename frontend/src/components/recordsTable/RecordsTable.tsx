import { useMasterSocket } from '@/hooks/MasterSocket';
import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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

import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { formatTime } from '@/lib/utils';
import TimeRecord from '@/interfaces/record';
import Athlete from '@/interfaces/athlete';
import Entry from '@/interfaces/entry';

const columns: ColumnDef<
  TimeRecord & { entry: Entry & { athlete: Athlete } }
>[] = [
  {
    header: 'Rank',
    id: 'rank',
    cell: ({ row }) => {
      const rank = row.index + 1;
      return <span className="font-semibold">{rank}</span>;
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
];

export default function RecordsTable({
  limit,
}: {
  limit?: number;
}): React.JSX.Element {
  const { data } = useMasterSocket();

  const [displayMode, setDisplayMode] = React.useState<'best' | 'all'>('best');

  const allRecordsFromBest = React.useMemo(() => {
    const records = data?.activeStartList?.session?.records ?? [];
    return [...records].sort((a, b) => {
      if (a.duration === null) return 1;
      if (b.duration === null) return -1;
      return Number(a.duration - b.duration);
    });
  }, [data?.activeStartList?.session?.records]);

  const bestPerEntryRecordsFromBest = React.useMemo(() => {
    const records = allRecordsFromBest;
    const bestRecords: Record<
      string,
      TimeRecord & { entry: Entry & { athlete: Athlete } }
    > = {};
    records.forEach((record) => {
      const key = record.entry.athlete.id;
      if (
        !bestRecords[key] ||
        (record.duration !== null &&
          (bestRecords[key].duration === null ||
            record.duration < bestRecords[key].duration))
      ) {
        bestRecords[key] = record;
      }
    });
    // Sort by duration ascending (lowest duration on top, nulls last)
    return Object.values(bestRecords).sort((a, b) => {
      if (a.duration === null) return 1;
      if (b.duration === null) return -1;
      return Number(a.duration - b.duration);
    });
  }, [allRecordsFromBest]);

  const table = useReactTable({
    data:
      displayMode === 'best' ? bestPerEntryRecordsFromBest : allRecordsFromBest,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <ToggleGroup
        type="single"
        value={displayMode}
        onValueChange={(setValue) => {
          if (setValue === 'best' || setValue === 'all') {
            setDisplayMode(setValue);
          } else {
            setDisplayMode(displayMode);
          }
        }}
        className="mb-4 flex w-full justify-center rounded-md border bg-secondary p-1"
      >
        <ToggleGroupItem
          value="best"
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          Best Records
        </ToggleGroupItem>
        <ToggleGroupItem
          value="all"
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          All Records
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="rounded-md border">
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
                  style={{
                    display: limit
                      ? row.index >= limit
                        ? 'none'
                        : 'table-row'
                      : 'table-row',
                  }}
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
      </div>
    </div>
  );
}
