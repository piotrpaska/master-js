export default interface Record {
  id: string;
  startListId: string;
  startTime: bigint;
  endTime: bigint | null;
  duration: bigint | null;
  track: string;
  trackId: string;
  status: 'OK' | 'DNF' | 'DSQ' | 'DNS';
  timestamp: Date;
  entryId: string;
}
