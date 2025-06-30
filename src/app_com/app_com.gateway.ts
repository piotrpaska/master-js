import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DeviceService } from 'src/device/device.service';
import { TrackService } from 'src/track/track.service';

@WebSocketGateway(3001, {
  transports: ['websocket'],
  cors: true,
})
export class AppComGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly trackService: TrackService,
    private readonly deviceService: DeviceService,
  ) {}

  handleConnection() {
    this.updateClientsData();
    console.log('[AppComGateway] Client connected');
  }

  handleDisconnect() {
    console.log('[AppComGateway] Client disconnected');
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('all')
  handleMessage(): string {
    return JSON.stringify({
      tracks: this.trackService.getTracks(),
      devices: this.deviceService.getAllDevices(),
    });
  }

  @SubscribeMessage('specified')
  handleSpecifiedMessage(@MessageBody() specified: string): string {
    switch (specified) {
      case 'tracks':
        return JSON.stringify({
          tracks: this.trackService.getTracks(),
        });
      case 'devices':
        return JSON.stringify({
          devices: this.deviceService.getAllDevices(),
        });
      default:
        return JSON.stringify({
          error: 'Invalid specified type. Use "tracks" or "devices".',
        });
    }
  }

  updateClientsData() {
    this.server.emit('data', {
      tracks: this.trackService.getTracks(),
      devices: this.deviceService.getAllDevices(),
    });
  }
}
