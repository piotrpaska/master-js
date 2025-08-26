import StartList from './startList';
import Entry from './entry';
import Athlete from './athlete';
import Record from './record';
import Session from './session';

export default interface ActiveStartList extends StartList {
  entries: (Entry & { athlete: Athlete })[];
  session:
    | (Session & {
        records: (Record & { entry: Entry & { athlete: Athlete } })[];
      })
    | null;
}
