import { Controller, Get, Param, Put } from '@nestjs/common';
import { DeviceService } from './device.service';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  getAllDevices() {
    return this.deviceService.getAllDevices();
  }

  @Put(':id/heartbeat')
  updateHeartbeat(@Param('id') id: string) {
    const heartbeat = new Date();
    return this.deviceService.updateHeartbeat(id, heartbeat);
  }
}
