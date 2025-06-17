import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { TrackService } from './track.service';
import { ConfigService } from '../config/config.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  port: new ConfigService().getConfig().ports.tracks,
})
export class TrackGateway {
  constructor(private readonly trackService: TrackService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('get')
  handleMessage(): string {
    return JSON.stringify(this.trackService.getTracksWithEntryData());
  }

  updateTracks() {
    const tracks = this.trackService.getTracksWithEntryData();
    this.server.emit('update', JSON.stringify(tracks));
  }
}
