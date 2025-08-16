import { forwardRef, Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { TrackModule } from 'src/track/track.module';
import { DeviceModule } from 'src/device/device.module';

@Module({
  imports: [forwardRef(() => TrackModule), forwardRef(() => DeviceModule)],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
