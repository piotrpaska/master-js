import { forwardRef, Module } from '@nestjs/common';
import { AppComGateway } from './app_com.gateway';
import { TrackModule } from 'src/track/track.module';
import { DeviceModule } from 'src/device/device.module';
import { StartListModule } from 'src/start-list/start-list.module';
import { EntryModule } from 'src/entry/entry.module';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => DeviceModule),
    forwardRef(() => StartListModule),
    forwardRef(() => EntryModule),
    ConfigModule,
  ],
  providers: [AppComGateway],
  exports: [AppComGateway],
})
export class AppComModule {}
