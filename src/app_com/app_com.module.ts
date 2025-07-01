import { forwardRef, Module } from '@nestjs/common';
import { AppComGateway } from './app_com.gateway';
import { TrackModule } from 'src/track/track.module';
import { DeviceModule } from 'src/device/device.module';

@Module({
  imports: [TrackModule, forwardRef(() => DeviceModule)],
  providers: [AppComGateway],
  exports: [AppComGateway],
})
export class AppComModule {}
