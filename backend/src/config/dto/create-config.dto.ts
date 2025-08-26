export class CreateConfigDto {
  resultsDir: string;
  speaker: {
    enabled: boolean;
    id: string;
    name: string;
  };
  tracks: {
    id: string;
    name: string;
    color: string;
  }[];
  sensors: {
    id: string;
    name: string;
    type: 'start' | 'finish';
    trackId: string;
  }[];
  options: {
    blockEntryAfterRun: boolean;
  };
}
