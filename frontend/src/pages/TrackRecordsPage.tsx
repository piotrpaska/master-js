import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMasterSocket } from '@/hooks/MasterSocket';
import Athlete from '@/interfaces/athlete';
import Entry from '@/interfaces/entry';
import TimeRecord from '@/interfaces/record';
import { formatTime } from '@/lib/utils';
import React from 'react';

export default function TrackRecordsPage(): React.JSX.Element {
  const { data } = useMasterSocket();

  const trackWithRecords = React.useMemo(() => {
    const tracks: Record<
      string,
      (TimeRecord & { entry: Entry & { athlete: Athlete } })[]
    > = {};

    if (data) {
      if (!data.activeStartList) {
        return null;
      }

      data.tracks.forEach((record) => {
        if (!tracks[record.id]) {
          tracks[record.id] = [];
        }
      });

      data.activeStartList?.session?.records.forEach((record) => {
        if (tracks[record.trackId]) {
          tracks[record.trackId].push(record);
        }
      });

      for (const trackId in tracks) {
        tracks[trackId].sort((a, b) => {
          const timeA = a.duration === null ? Infinity : Number(a.duration);
          const timeB = b.duration === null ? Infinity : Number(b.duration);
          return timeA - timeB;
        });
      }

      return tracks;
    }

    return null;
  }, [data]);

  return (
    <div>
      <h1>Track Records</h1>
      <div className="flex gap-4 mt-4 w-full overflow-scroll">
        {Object.entries(trackWithRecords ?? {}).map(([trackId, records]) => (
          <div className="w-full" key={trackId}>
            <h2 className="text-sm md:text-base xl:text-3xl font-bold mb-1">
              {data?.tracks.find((t) => t.id === trackId)?.name ||
                'Unknown Track'}
            </h2>
            <Table className="text-xl">
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Time</TableHead>
                  <TableHead className="text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow
                    key={record.id}
                    className={
                      record.duration === null ? 'text-muted-foreground' : ''
                    }
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{record.entry.athlete.name}</TableCell>
                    <TableCell className="text-center">
                      {record.duration !== null
                        ? formatTime(Number(record.duration), false)
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
}
