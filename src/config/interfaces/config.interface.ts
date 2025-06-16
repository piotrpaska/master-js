export interface Config {
  ports: {
    http: number;
    sensors: number;
    speaker: number;
  };
  speaker: SpeakerConfig;
  tracks: TrackConfig[];
}

export interface TrackConfig {
  id: string;
  name: string;
  color: string;
  sensors: SensorConfig[];
}

export interface SensorConfig {
  id: string;
  name: string;
  type: 'start' | 'finish';
  trackId: string; // Reference to the track this sensor belongs to
}

export interface SpeakerConfig {
  id: string;
  name: string;
  enabled: boolean;
}
