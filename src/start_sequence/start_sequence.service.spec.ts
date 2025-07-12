import { Test, TestingModule } from '@nestjs/testing';
import { StartSequenceService } from './start_sequence.service';

describe('StartSequenceService', () => {
  let service: StartSequenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StartSequenceService],
    }).compile();

    service = module.get<StartSequenceService>(StartSequenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
