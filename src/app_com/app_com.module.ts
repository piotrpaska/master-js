import { forwardRef, Module } from '@nestjs/common';
import { AppComGateway } from './app_com.gateway';
import { TrackModule } from 'src/track/track.module';
import { DeviceModule } from 'src/device/device.module';
import { StartListModule } from 'src/start-list/start-list.module';

@Module({
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => DeviceModule),
    forwardRef(() => StartListModule),
  ],
  providers: [AppComGateway],
  exports: [AppComGateway],
})
export class AppComModule {}
