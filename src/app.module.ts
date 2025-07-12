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
import { DeviceModule } from './device/device.module';
import { SpeakerModule } from './speaker/speaker.module';
import { AppComModule } from './app_com/app_com.module';
import { StartSequenceModule } from './start_sequence/start_sequence.module';
import { CountdownModule } from './countdown/countdown.module';

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
    DeviceModule,
    SpeakerModule,
    AppComModule,
    StartSequenceModule,
    CountdownModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
