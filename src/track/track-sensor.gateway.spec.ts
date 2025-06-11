import { Test, TestingModule } from '@nestjs/testing';
import { TrackGateway } from './track-sensor.gateway';

describe('TrackGateway', () => {
  let gateway: TrackGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackGateway],
    }).compile();

    gateway = module.get<TrackGateway>(TrackGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
