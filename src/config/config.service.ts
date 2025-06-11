import { Injectable } from '@nestjs/common';
import { Config } from './interfaces/config.interface';
import * as fs from 'fs';
import { load } from 'js-yaml';
import { z } from 'zod';

const configSchema = z
  .object({
    ports: z.object({
      http: z.number().int().positive(),
      sensors: z.number().int().positive(),
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
    } catch (e) {
      console.error('Error loading config file:', e);
      process.exit(1); // Exit if config cannot be loaded
    }
  }

  getConfig(): Config {
    return this.config;
  }
}
