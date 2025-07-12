import { Injectable } from '@nestjs/common';
import { SpeakerGateway } from 'src/speaker/speaker.gateway';
import { TrackService } from 'src/track/track.service';
import { CountdownGateway } from 'src/countdown/countdown.gateway';

@Injectable()
export class StartSequenceService {
  constructor(
    private speakerGateway: SpeakerGateway,
    private trackService: TrackService,
    private countdownGateway: CountdownGateway,
  ) {}

  private tracksStartTime: number | null = null;
  private startDelay: number = 10000; // 10 seconds
  private startTimeoutId: NodeJS.Timeout | null = null;

  startSequence() {
    if (this.tracksStartTime === null) {
      this.tracksStartTime = Date.now() + this.startDelay;
      this.speakerGateway.updateSpeakersStartTime(this.tracksStartTime);
      this.countdownGateway.startCountdown(this.startDelay / 1000);

      this.startTimeoutId = setTimeout(() => {
        if (this.tracksStartTime !== null) {
          this.trackService
            .startAllTracks(this.tracksStartTime)
            .then(() => {
              // Tracks started
            })
            .catch((err) => {
              console.error('Error starting tracks:', err);
            });
        }
        this.startTimeoutId = null;
        this.tracksStartTime = null;
        this.speakerGateway.updateSpeakersStartTime(null);
      }, this.startDelay);

      console.log(
        `Start sequence initiated at ${new Date(this.tracksStartTime).toLocaleTimeString()}`,
      );
    } else {
      console.warn('Start sequence already initiated.');
    }
  }

  stopSequence() {
    if (this.tracksStartTime !== null) {
      this.tracksStartTime = null;
      this.speakerGateway.updateSpeakersStartTime(null);
      this.countdownGateway.stopCountdown();
      if (this.startTimeoutId) {
        clearTimeout(this.startTimeoutId);
        this.startTimeoutId = null;
      }
      console.log('Start sequence stopped.');
    } else {
      console.warn('No active start sequence to stop.');
    }
  }
}
