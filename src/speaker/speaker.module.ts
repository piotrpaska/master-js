import { Module } from '@nestjs/common';
import { SpeakerGateway } from './speaker.gateway';
import { ConfigModule } from 'src/config/config.module';
import { DeviceModule } from 'src/device/device.module';

@Module({
  imports: [ConfigModule, DeviceModule],
  providers: [SpeakerGateway],
  exports: [SpeakerGateway],
})
export class SpeakerModule {}
