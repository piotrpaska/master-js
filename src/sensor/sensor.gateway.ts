import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { TrackService } from 'src/track/track.service';
import { Server } from 'ws';
import { DeviceService } from 'src/device/device.service';
import { z } from 'zod';

const sensorDataSchema = z.object({
  sensorId: z.string(),
  timestamp: z.number(),
});

@Injectable()
export class SensorGateway implements OnModuleInit {
  constructor(
    private readonly trackService: TrackService,
    private readonly configService: ConfigService,
    private readonly deviceService: DeviceService,
  ) {}

  private wss: Server;

  onModuleInit() {
    this.wss = new Server({
      port: 4000,
    });

    this.wss.on('listening', () => {
      console.log('Sensor WebSocket server is listening on port 4000');
    });

    this.wss.on('connection', (ws, req) => {
      console.log('New sensor connected');

      const clientId = req.url?.split('/').pop() || null;

      if (!clientId) {
        console.error('Client ID not provided in the request URL');
        ws.close();
        return;
      }

      if (
        !this.deviceService.getDeviceById(clientId) ||
        this.deviceService.getDeviceById(clientId)?.type !== 'sensor'
      ) {
        ws.close();
        console.error(`Client ID ${clientId} not found`);
        return;
      }

      if (this.deviceService.getDeviceById(clientId)?.liveConnected) {
        ws.close();
        console.error(`Client ID ${clientId} is already connected`);
        return;
      }

      void this.deviceService.setLiveConnection(clientId, true);

      ws.on('message', (message: string) => {
        console.log(`Received message from sensor: ${message}`);

        const sensorData = JSON.parse(message) as unknown;

        const validation = sensorDataSchema.safeParse(sensorData);
        if (!validation.success) {
          console.error('Invalid sensor data:', validation.error);
          return;
        }

        // Process the validated sensor data
        this.handleSensorData(validation.data).catch((err) => {
          console.error('Error handling sensor data:', err);
          ws.send(
            JSON.stringify({
              status: 'error',
              message: 'Failed to process sensor data',
            }),
          );
        });

        ws.send(
          JSON.stringify({ status: 'success', message: 'Data received' }),
        );
      });

      ws.on('close', () => {
        console.log('Sensor disconnected');
        this.deviceService.setLiveConnection(clientId, false).catch((err) => {
          console.error('Error setting live connection to false:', err);
        });
      });
    });
  }

  private async handleSensorData(
    data: z.infer<typeof sensorDataSchema>,
  ): Promise<void> {
    const trackId = this.configService.getTrackIdBySensorId(data.sensorId);

    if (!trackId) {
      console.error(`No track found for sensor ID: ${data.sensorId}`);
      return;
    }

    const sensorType = this.configService.getSensorTypeById(data.sensorId);
    if (!sensorType) {
      console.error(`No sensor type found for sensor ID: ${data.sensorId}`);
      return;
    }

    if (sensorType === 'start') {
      await this.trackService.startTrack(trackId, data.timestamp);
    } else if (sensorType === 'finish') {
      await this.trackService.stopTrackAndSaveTime(trackId, data.timestamp);
    } else {
      console.error(`Unknown sensor type for sensor ID: ${data.sensorId}`);
      throw new Error(`Unknown sensor type for sensor ID: ${data.sensorId}`);
    }

    console.log(`Processed sensor data for track ${trackId}:`, data);
  }
}
