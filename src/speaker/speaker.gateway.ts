import { OnModuleInit, Request } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConfigService } from 'src/config/config.service';
import { Server, Socket } from 'socket.io';
import { DeviceService } from 'src/device/device.service';

@WebSocketGateway(new ConfigService().getConfig().ports.speaker, {
  cors: {
    origin: '*',
  },
})
export class SpeakerGateway implements OnModuleInit, OnGatewayConnection {
  constructor(
    private readonly configService: ConfigService,
    private readonly deviceService: DeviceService,
  ) {}

  @WebSocketServer()
  private wss: Server;

  onModuleInit() {
    if (!this.getSpeakerConfig().enabled) {
      console.log('Speaker is disabled in the configuration');
      return;
    }
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    /*if (!clientId) {
      console.error('Client ID not provided in the request URL');
      client.disconnect();
      return;
    }

    if (this.getSpeakerConfig().id !== clientId) {
      console.error(
        `Client ID ${clientId} does not match configured speaker ID ${this.getSpeakerConfig().id}`,
      );
      client.disconnect();
      return;
    }*/
  }

  private getSpeakerConfig() {
    return this.configService.getConfig().speaker;
  }

  updateSpeakersStartTime(startTime: number | null) {
    if (!this.wss) {
      console.error('WebSocket server is not initialized');
      return;
    }

    this.wss.emit('speakersStartTime', startTime);
  }

  clearSpeakersStartTime() {
    this.wss.emit('clearSpeakersStartTime');
  }

  signalizeTrackStop() {
    if (!this.wss) {
      console.error('WebSocket server is not initialized');
      return;
    }

    this.wss.emit('trackStop');
  }
}
