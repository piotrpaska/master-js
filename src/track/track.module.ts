import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TrackService } from './track.service';
import { EntryModule } from 'src/entry/entry.module';
import { TrackGateway } from './track-sensor.gateway';
import { RecordModule } from 'src/record/record.module';

@Module({
  imports: [PrismaModule, EntryModule, RecordModule],
  controllers: [TrackController],
  providers: [TrackService, TrackGateway],
  exports: [TrackService, TrackGateway],
})
export class TrackModule {}
