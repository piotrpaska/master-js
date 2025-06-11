import { Injectable, OnModuleInit } from '@nestjs/common';
import { TrackService } from './track.service';
import { Server, WebSocket } from 'ws';

@Injectable()
export class TrackGateway implements OnModuleInit {
  constructor(private readonly trackService: TrackService) {}

  private wss: Server;

  onModuleInit() {
    this.wss = new Server({ port: 3001 });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New client connected');

      ws.on('message', (message: string) => {
        console.log(`Received message: ${message}`);
        // Handle incoming messages from the client
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }
}
