import { Controller, Post } from '@nestjs/common';
import { StartSequenceService } from './start_sequence.service';

@Controller('start-seq')
export class StartSequenceController {
  constructor(private readonly startSequenceService: StartSequenceService) {}

  @Post('start')
  startSequence() {
    this.startSequenceService.startSequence();
  }

  @Post('stop')
  stopSequence() {
    this.startSequenceService.stopSequence();
  }
}
