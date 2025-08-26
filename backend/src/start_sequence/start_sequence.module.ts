import { Module } from '@nestjs/common';
import { StartSequenceService } from './start_sequence.service';
import { SpeakerModule } from 'src/speaker/speaker.module';
import { TrackModule } from 'src/track/track.module';
import { CountdownModule } from 'src/countdown/countdown.module';
import { StartSequenceController } from './start_sequence.controller';

@Module({
  providers: [StartSequenceService],
  imports: [SpeakerModule, TrackModule, CountdownModule],
  controllers: [StartSequenceController],
})
export class StartSequenceModule {}
