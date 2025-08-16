export class CreateConfigDto {
  resultsDir: string;
  ports: {
    sensors: number;
    speaker: number;
    app_com: number;
    countdown: number;
  };
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
}
