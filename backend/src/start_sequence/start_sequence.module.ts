import { Module } from '@nestjs/common';
import { StartSequenceService } from './start_sequence.service';
import { SpeakerModule } from 'src/speaker/speaker.module';
import { TrackModule } from 'src/track/track.module';
import { CountdownModule } from 'src/countdown/countdown.module';
import { StartSequenceController } from './start_sequence.controller';
import { ConfigModule } from 'src/config/config.module';

@Module({
  providers: [StartSequenceService],
  imports: [SpeakerModule, TrackModule, CountdownModule, ConfigModule],
  controllers: [StartSequenceController],
})
export class StartSequenceModule {}
