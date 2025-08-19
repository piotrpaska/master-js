import { ConfigService } from 'src/config/config.service';
import { TrackService } from 'src/track/track.service';
import { Server, Socket } from 'socket.io';
import { DeviceService } from 'src/device/device.service';
import { z } from 'zod';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

const sensorDataSchema = z.object({
  sensorId: z.string(),
  timestamp: z.number(),
});

@WebSocketGateway(4000, {
  cors: {
    origin: '*',
  },
})
export class SensorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly trackService: TrackService,
    private readonly configService: ConfigService,
    private readonly deviceService: DeviceService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    const auth = client.handshake.auth as { id?: string } | undefined;
    const clientId = auth?.id || null;

    if (!clientId) {
      console.error('Client ID not provided');
      client.disconnect();
      return;
    }

    if (!this.deviceService.getDeviceById(clientId)) {
      client.disconnect();
      console.error(`Client ID ${clientId} not found`);
      return;
    }

    if (this.deviceService.getDeviceById(clientId)?.liveConnected) {
      client.disconnect();
      console.error(`Client ID ${clientId} is already connected`);
      return;
    }

    void this.deviceService.setLiveConnection(clientId, true);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const auth = client.handshake.auth as { id?: string } | undefined;
    const clientId = auth?.id || null;

    if (!clientId) {
      console.error('Client ID not provided in the request URL');
      client.disconnect();
      return;
    }

    void this.deviceService.setLiveConnection(clientId, false);
  }

  @SubscribeMessage('sensorSignal')
  async handleSensorSignal(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: z.infer<typeof sensorDataSchema>,
  ): Promise<void> {
    const validation = sensorDataSchema.safeParse(payload);
    if (!validation.success) {
      console.error('Invalid sensor data:', validation.error);
      return;
    }

    // Process the validated sensor data
    await this.handleSensorData(validation.data).catch((err) => {
      console.error('Error handling sensor data:', err);
      client.emit('sensorDataResponse', {
        status: 'error',
        message: 'Failed to process sensor data',
      });
    });

    client.emit('sensorDataResponse', {
      status: 'success',
      message: 'Data received',
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
