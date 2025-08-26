import { useMasterSocket } from '@/hooks/MasterSocket';
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
} from '../ui/table';

function calculateLastHeartbeat(lastHeartbeat: Date | string | null): string {
  if (!lastHeartbeat) return 'N/A';
  const heartbeatDate =
    typeof lastHeartbeat === 'string' ? new Date(lastHeartbeat) : lastHeartbeat;
  if (isNaN(heartbeatDate.getTime())) return 'Invalid date';
  const timeDiff = Date.now() - heartbeatDate.getTime();
  return `${Math.floor(timeDiff / 1000)} seconds ago`;
}

export default function DevicesTable(): React.JSX.Element {
  const { data } = useMasterSocket();

  if (!data || data.devices.length === 0) {
    return (
      <div className="flex flex-col gap-4 text-center justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-gray-500">No Data Available</h1>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Last HB</TableHead>
          <TableHead>Live</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.devices.map((device) => (
          <TableRow key={device.id}>
            <TableCell>{device.id}</TableCell>
            <TableCell>{device.name}</TableCell>
            <TableCell>{device.type}</TableCell>
            <TableCell>
              {calculateLastHeartbeat(device.lastHeartbeat)}
            </TableCell>
            <TableCell>
              {device.liveConnected ? (
                <span className="text-green-500">Yes</span>
              ) : (
                <span className="text-red-500">No</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
