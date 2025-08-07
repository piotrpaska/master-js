import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from 'src/config/config.service';

@WebSocketGateway(new ConfigService().getConfig().ports.countdown, {
  transports: ['websocket'],
})
export class CountdownGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  private countDownInterval: NodeJS.Timeout | null = null;

  handleConnection(client: Socket) {
    if (!this.countDownInterval) {
      client.emit('countdown', 0);
    }
  }

  startCountdown(duration: number) {
    if (this.countDownInterval) {
      clearInterval(this.countDownInterval);
    }

    let timeLeft = duration;

    this.server.emit('countdown', timeLeft);
    timeLeft--;

    this.countDownInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(this.countDownInterval!);
        this.server.emit('countdown', 0);
      } else {
        this.server.emit('countdown', timeLeft);
        timeLeft--;
      }
    }, 1000);
  }

  stopCountdown() {
    if (this.countDownInterval) {
      clearInterval(this.countDownInterval);
      this.countDownInterval = null;
    }
    this.server.emit('countdown', 0);
  }
}
