import { forwardRef, Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { ConfigModule } from 'src/config/config.module';
import { DeviceService } from './device.service';
import { AppComModule } from 'src/app_com/app_com.module';

@Module({
  imports: [ConfigModule, forwardRef(() => AppComModule)],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
