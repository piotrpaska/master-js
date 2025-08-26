import { Test, TestingModule } from '@nestjs/testing';
import { SpeakerGateway } from './speaker.gateway';

describe('SpeakerGateway', () => {
  let gateway: SpeakerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpeakerGateway],
    }).compile();

    gateway = module.get<SpeakerGateway>(SpeakerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
