export interface Config {
  ports: {
    http: number;
    sensors: number;
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
    sensors: {
      id: string;
      name: string;
      type: 'start' | 'finish';
    }[];
  };
}
