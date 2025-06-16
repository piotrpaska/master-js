export class CreateRecordDto {
  startTime: number;
  endTime: number | null;
  duration: number | null;
  startListId: string;
  track: string;
  entryId: string;
  timestamp: Date;
  status: 'OK' | 'DNS' | 'DNF' | 'DSQ';
}
