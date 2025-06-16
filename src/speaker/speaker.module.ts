import { Module } from '@nestjs/common';
import { SpeakerGateway } from './speaker.gateway';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [SpeakerGateway],
  exports: [SpeakerGateway],
})
export class SpeakerModule {}
