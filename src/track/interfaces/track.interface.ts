export interface Track {
  id: string;
  startTime: bigint;
  prevDuration: bigint;
  running: boolean;
  entryId: string | null;
}
