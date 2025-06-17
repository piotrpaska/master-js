import { Injectable } from '@nestjs/common';
import { Config, TrackConfig } from './interfaces/config.interface';
import * as fs from 'fs';
import { load } from 'js-yaml';
import { z } from 'zod';

const configSchema = z
  .object({
    ports: z.object({
      http: z.number().int().positive(),
      sensors: z.number().int().positive(),
      speaker: z.number().int().positive(),
      tracks: z.number().int().positive(),
    }),
    speaker: z.object({
      enabled: z.boolean(),
      id: z.string(),
      name: z.string(),
    }),
    tracks: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        color: z.string(),
        sensors: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            type: z.enum(['start', 'finish']),
          }),
        ),
      }),
    ),
  })
  .strict();

@Injectable()
export class ConfigService {
  private config: Config;
  private sensorsWithTrack: Map<
    string,
    { trackId: string; sensorType: 'start' | 'finish' }
  >;

  constructor() {
    this.loadConfig(); // Ensure config is loaded as soon as the service is instantiated
  }

  private loadConfig() {
    // Load and parse the config file
    const configPath = './config.yaml'; // Adjust path as needed

    try {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      this.config = load(fileContents) as Config;

      // Validate the config against the Zod schema
      const parsedConfig = configSchema.safeParse(this.config);
      if (!parsedConfig.success) {
        console.error('Config validation error:', parsedConfig.error.errors);
        process.exit(1); // Exit if config is invalid
      }
      this.config = parsedConfig.data as unknown as Config; // Assign validated config with double cast

      const tracks: TrackConfig[] = this.config.tracks;

      this.sensorsWithTrack = tracks
        .map((track) => {
          return track.sensors.map((sensor) => ({
            id: sensor.id,
            trackId: track.id,
            sensorType: sensor.type,
          }));
        })
        .reduce((acc, curr) => {
          curr.forEach((sensor) => {
            acc.set(sensor.id, {
              trackId: sensor.trackId,
              sensorType: sensor.sensorType,
            });
          });
          return acc;
        }, new Map<string, { trackId: string; sensorType: 'start' | 'finish' }>());

      console.log('Config loaded successfully:', this.config);
      console.log('Sensors with track mapping:', this.sensorsWithTrack);
    } catch (e) {
      console.error('Error loading config file:', e);
      process.exit(1); // Exit if config cannot be loaded
    }
  }

  refreshConfig() {
    this.loadConfig(); // Reload the configuration
  }

  getConfig(): Config {
    return this.config;
  }

  getTrackIdBySensorId(sensorId: string): string | null {
    const sensorInfo = this.sensorsWithTrack.get(sensorId);
    return sensorInfo ? sensorInfo.trackId : null;
  }

  getSensorTypeById(sensorId: string): 'start' | 'finish' | null {
    const sensorInfo = this.sensorsWithTrack.get(sensorId);
    return sensorInfo ? sensorInfo.sensorType : null;
  }

  getInitialDevices(): {
    id: string;
    name: string;
    type: 'sensor' | 'speaker';
  }[] {
    const sensors = this.config.tracks.flatMap((track) =>
      track.sensors.map((sensor) => ({
        id: sensor.id,
        name: sensor.name,
        type: 'sensor' as const,
      })),
    );
    const speaker = this.config.speaker.enabled
      ? [
          {
            id: this.config.speaker.id,
            name: this.config.speaker.name,
            type: 'speaker' as const,
          },
        ]
      : [];
    return [...sensors, ...speaker];
  }
}
