import Entry from '@/interfaces/entry';
import Athlete from '@/interfaces/athlete';
import StartList from '@/interfaces/startList';
import Session from '@/interfaces/session';
import Record from './record';

export default interface DetailedStartList extends StartList {
  entries: (Entry & { athlete: Athlete })[];
  sessions:
    | (Session & {
        records: (Record & { entry: Entry & { athlete: Athlete } })[];
      })[]
    | null;
}
