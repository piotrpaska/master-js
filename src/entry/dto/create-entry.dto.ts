export class CreateEntryDto {
  athleteId: string;
  startListId: string;
  bib: string;
  alreadyStarted?: boolean;
}
