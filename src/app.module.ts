import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AthleteModule } from './athlete/athlete.module';
import { RecordModule } from './record/record.module';
import { EntryModule } from './entry/entry.module';
import { StartListModule } from './start-list/start-list.module';

@Module({
  imports: [PrismaModule, AthleteModule, RecordModule, EntryModule, StartListModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
