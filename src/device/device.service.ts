import { Injectable, OnModuleInit } from '@nestjs/common';
import { Device } from './interfaces/device.interface';
import { CreateDeviceDto } from './dto/create-device.dto';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class DeviceService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    // Initialize devices from configuration or database if needed
    const initialDevices = this.configService.getInitialDevices();
    if (initialDevices) {
      for (const device of initialDevices) {
        try {
          this.registerDevice(device);
        } catch (error) {
          console.error(`Failed to register device ${device.id}:`, error);
        }
      }
    }
  }

  private devices: Device[] = [];

  getAllDevices(): Device[] {
    return this.devices;
  }

  getDeviceById(id: string): Device | undefined {
    return this.devices.find((device) => device.id === id);
  }

  registerDevice(data: CreateDeviceDto): Device {
    const existingDevice = this.getDeviceById(data.id);
    if (existingDevice) {
      throw new Error(`Device with id ${data.id} already exists.`);
    }
    const newDevice = {
      ...data,
      lastHeartbeat: null,
      liveConnected: false,
    };
    this.devices.push(newDevice);
    return newDevice;
  }

  updateHeartbeat(id: string, heartbeat: Date): Device | undefined {
    const device = this.getDeviceById(id);
    if (!device) {
      throw new Error(`Device with id ${id} not found.`);
    }
    device.lastHeartbeat = heartbeat;
    return device;
  }

  setLiveConnection(id: string, isConnected: boolean): Device | undefined {
    const device = this.getDeviceById(id);
    if (!device) {
      throw new Error(`Device with id ${id} not found.`);
    }
    device.liveConnected = isConnected;
    return device;
  }
}
