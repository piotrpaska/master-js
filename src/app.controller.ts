import { Controller, Get } from '@nestjs/common';
import { TrackGateway } from './track/track-sensor.gateway';

@Controller()
export class AppController {
  constructor(private trackGateway: TrackGateway) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
