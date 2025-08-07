import { forwardRef, Inject } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ConfigService } from 'src/config/config.service';
import { DeviceService } from 'src/device/device.service';
import { StartListService } from 'src/start-list/start-list.service';
import { TrackService } from 'src/track/track.service';

@WebSocketGateway(new ConfigService().getConfig().ports.app_com, {
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class AppComGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => DeviceService))
    private readonly deviceService: DeviceService,
    @Inject(forwardRef(() => StartListService))
    private readonly startListService: StartListService,
  ) {}

  async handleConnection() {
    await this.updateClientsData();
    console.log('[AppComGateway] Client connected');
  }

  handleDisconnect() {
    console.log('[AppComGateway] Client disconnected');
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('all')
  async handleMessage(): Promise<string> {
    return JSON.stringify({
      tracks: await this.trackService.getTracksWithEntryData(),
      devices: this.deviceService.getAllDevices(),
    });
  }

  @SubscribeMessage('specified')
  async handleSpecifiedMessage(
    @MessageBody() specified: string,
  ): Promise<string> {
    switch (specified) {
      case 'tracks':
        return JSON.stringify({
          tracks: await this.trackService.getTracksWithEntryData(),
        });
      case 'devices':
        return JSON.stringify({
          devices: this.deviceService.getAllDevices(),
        });
      case 'activeStartList':
        return JSON.stringify({
          activeStartList: await this.startListService.getActiveStartList(),
        });
      default:
        return JSON.stringify({
          error: 'Invalid specified type. Use "tracks" or "devices".',
        });
    }
  }

  async updateClientsData() {
    this.server.emit('data', {
      tracks: await this.trackService.getTracksWithEntryData(),
      devices: this.deviceService.getAllDevices(),
      activeStartList: await this.startListService.getActiveStartList(),
    });
  }
}
