import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TrackService } from './track.service';
import { EntryModule } from 'src/entry/entry.module';

@Module({
  imports: [PrismaModule, EntryModule],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
