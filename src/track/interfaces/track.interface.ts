export interface Track {
  id: string;
  name: string;
  startTime: number | null;
  prevDuration: number | null;
  running: boolean;
  entryId: string | null;
  relatedLastRecordId: string | null;
}
