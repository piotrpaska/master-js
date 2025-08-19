import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { load } from 'js-yaml';
import { z } from 'zod';
import * as yaml from 'js-yaml';
import { TrackService } from 'src/track/track.service';
import { DeviceService } from 'src/device/device.service';

const configSchema = z
  .object({
    resultsDir: z.string(),
    ports: z.object({
      sensors: z.number().int().positive(),
      speaker: z.number().int().positive(),
      app_com: z.number().int().positive(),
      countdown: z.number().int().positive(),
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
      }),
    ),
    sensors: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['start', 'finish']),
        trackId: z.string(),
      }),
    ),
  })
  .strict();

type Config = z.infer<typeof configSchema>;

@Injectable()
export class ConfigService {
  private config: Config;

  constructor(
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => DeviceService))
    private readonly deviceService: DeviceService,
  ) {
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

      console.log('Config loaded successfully:', this.config);
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
    const sensor = this.config.sensors.find((sensor) => sensor.id === sensorId);
    return sensor ? sensor.trackId : null;
  }

  getSensorTypeById(sensorId: string): 'start' | 'finish' | null {
    const sensorInfo = this.config.sensors.find(
      (sensor) => sensor.id === sensorId,
    );
    return sensorInfo ? sensorInfo.type : null;
  }

  getInitialDevices(): {
    id: string;
    name: string;
    type: 'sensor' | 'speaker';
  }[] {
    const sensors = this.config.sensors.map((sensor) => ({
      id: sensor.id,
      name: sensor.name,
      type: 'sensor' as const,
    }));
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

  async updateConfig(newConfig: Config) {
    const yamlString = yaml.dump(newConfig);

    await fs.promises.writeFile('./config.yaml', yamlString, 'utf8');
    this.refreshConfig();
    this.trackService?.reInitTracks();
    await this.deviceService?.reInitDevices();
  }
}
