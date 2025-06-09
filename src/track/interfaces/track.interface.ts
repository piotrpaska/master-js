export interface Track {
  id: string;
  name: string;
  startTime: bigint | null;
  prevDuration: bigint | null;
  running: boolean;
  entryId: string | null;
  relatedLastRecordId: string | null;
}
