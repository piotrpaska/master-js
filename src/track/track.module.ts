import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TrackService } from './track.service';
import { EntryModule } from 'src/entry/entry.module';
import { RecordModule } from 'src/record/record.module';
import { ConfigModule } from 'src/config/config.module';
import { SpeakerModule } from 'src/speaker/speaker.module';
import { TrackGateway } from './track.gateway';

@Module({
  imports: [
    PrismaModule,
    EntryModule,
    RecordModule,
    ConfigModule,
    SpeakerModule,
  ],
  controllers: [TrackController],
  providers: [TrackService, TrackGateway],
  exports: [TrackService],
})
export class TrackModule {}
