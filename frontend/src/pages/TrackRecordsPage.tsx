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
            <h2 className="text-lg font-bold">
              {data?.tracks.find((t) => t.id === trackId)?.name ||
                'Unknown Track'}
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={record.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{record.entry.athlete.name}</TableCell>
                    <TableCell>
                      {formatTime(Number(record.duration ?? 0), false)}
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
