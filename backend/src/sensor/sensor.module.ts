import { Module } from '@nestjs/common';
import { SensorGateway } from './sensor.gateway';
import { TrackModule } from 'src/track/track.module'; // Assuming TrackModule is defined in track.module.ts
import { ConfigModule } from 'src/config/config.module';
import { DeviceModule } from 'src/device/device.module';

@Module({
  imports: [TrackModule, ConfigModule, DeviceModule],
  providers: [SensorGateway],
})
export class SensorModule {}
