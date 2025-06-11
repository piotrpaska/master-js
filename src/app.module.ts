import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AthleteModule } from './athlete/athlete.module';
import { RecordModule } from './record/record.module';
import { EntryModule } from './entry/entry.module';
import { StartListModule } from './start-list/start-list.module';
import { TrackModule } from './track/track.module';
import { ConfigModule } from './config/config.module';
import { SensorModule } from './sensor/sensor.module';

@Module({
  imports: [
    PrismaModule,
    AthleteModule,
    RecordModule,
    EntryModule,
    StartListModule,
    TrackModule,
    ConfigModule,
    SensorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
