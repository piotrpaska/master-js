import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { Server } from 'ws';

@Injectable()
export class SpeakerGateway implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  private activeSpeakerTime: number | null = null;

  private wss: Server;
  onModuleInit() {
    if (!this.getSpeakerConfig().enabled) {
      console.log('Speaker is disabled in the configuration');
      return;
    }

    this.wss = new Server({
      port: this.configService.getConfig().ports.speaker,
    });

    this.wss.on('listening', () => {
      console.log(
        `Speaker WebSocket server is listening on port ${this.configService.getConfig().ports.speaker}`,
      );
    });

    this.wss.on('connection', (ws, req) => {
      console.log('New speaker connected');

      const clientId = req.url?.split('/').pop() || null;

      if (!clientId) {
        console.error('Client ID not provided in the request URL');
        ws.close();
        return;
      }

      if (this.getSpeakerConfig().id !== clientId) {
        console.error(
          `Client ID ${clientId} does not match configured speaker ID ${this.getSpeakerConfig().id}`,
        );
        ws.close();
        return;
      }

      ws.on('message', (message: string) => {
        console.log(`Received message from speaker: ${message}`);
        // Handle incoming messages from the speaker if needed
      });

      ws.on('close', () => {
        console.log(`Speaker ${clientId} disconnected`);
      });
    });
  }

  private getSpeakerConfig() {
    return this.configService.getConfig().speaker;
  }

  updateStartTime(time: number): void {
    if (!this.wss || this.wss.clients.size === 0) {
      console.warn('No connected speakers to send start time');
      return;
    }

    this.activeSpeakerTime = time;

    this.wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(this.activeSpeakerTime!.toString());
      }
    });
  }

  stopActiveSound(): void {
    if (!this.wss || this.wss.clients.size === 0) {
      console.warn('No connected speakers to stop sound');
      return;
    }
    this.activeSpeakerTime = null;
    this.wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send('stop');
      }
    });
  }

  getActiveSpeakerTime(): number | null {
    return this.activeSpeakerTime;
  }
}
