import Athlete from './athlete';
import Entry from './entry';
import StartList from './startList';

export interface Track {
  id: string;
  name: string;
  startTime: number | null;
  prevDuration: number | null;
  running: boolean;
  entryId: string | null;
  relatedLastRecordId: string | null;
  elapsedTime: number | null;
  entry: (Entry & { athlete: Athlete; startList: StartList }) | null;
}
