import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { TrackService } from './track.service';
//import { ConfigService } from '../config/config.service';
import { Server } from 'socket.io';
import { ConfigService } from 'src/config/config.service';

@WebSocketGateway(
  new ConfigService().getConfig().ports.tracks, // Default port if not set
  {
    transports: ['websocket'],
    cors: true,
  },
)
export class TrackGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly trackService: TrackService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection() {
    console.info('[TrackGateway] Client connected');
    await this.sendTracks();
  }

  handleDisconnect() {
    console.info('[TrackGateway] Client disconnected');
  }

  @SubscribeMessage('get')
  async handleGetTracks(): Promise<string> {
    console.info('[TrackGateway] Received "get" message');
    await this.sendTracks();
    return 'Tracks sent';
  }

  private async sendTracks() {
    try {
      const tracks = await this.trackService.getTracksWithEntryData();
      console.debug('[TrackGateway] Emitting "update" with tracks data');
      this.server.emit('update', tracks);
    } catch (error) {
      console.error('[TrackGateway] Error sending tracks:', error);
    }
  }
}
