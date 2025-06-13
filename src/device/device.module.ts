import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { ConfigModule } from 'src/config/config.module';
import { DeviceService } from './device.service';

@Module({
  imports: [ConfigModule],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
