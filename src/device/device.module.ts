import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { ConfigModule } from 'src/config/config.module';
import { DeviceService } from './device.service';
import { DeviceGateway } from './device.gateway';

@Module({
  imports: [ConfigModule],
  controllers: [DeviceController],
  providers: [DeviceService, DeviceGateway],
  exports: [DeviceService],
})
export class DeviceModule {}
