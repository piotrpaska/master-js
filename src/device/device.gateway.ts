import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DeviceService } from './device.service';
import { ConfigService } from 'src/config/config.service';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway(new ConfigService().getConfig().ports.devices, {
  cors: true,
  transports: ['websocket'],
})
export class DeviceGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(private readonly deviceService: DeviceService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    console.log(
      '[DeviceGateway] Gateway initialized on port',
      new ConfigService().getConfig().ports.devices,
    );

    setInterval(() => {
      this.updateDevices();
    }, 5000); // Update devices every 5 seconds
  }

  handleConnection() {
    console.log('[DeviceGateway] Client connected');
    this.updateDevices();
  }

  handleDisconnect() {
    console.log('[DeviceGateway] Client disconnected');
    this.updateDevices();
  }

  @SubscribeMessage('get')
  handleGetDevices(): string {
    const devices = this.deviceService.getAllDevices();
    this.server.emit('update', devices);
    return 'Devices sent';
  }

  updateDevices() {
    const devices = this.deviceService.getAllDevices();
    this.server.emit('update', devices);
  }
}
