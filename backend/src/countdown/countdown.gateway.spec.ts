import { Test, TestingModule } from '@nestjs/testing';
import { CountdownGateway } from './countdown.gateway';

describe('CountdownGateway', () => {
  let gateway: CountdownGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountdownGateway],
    }).compile();

    gateway = module.get<CountdownGateway>(CountdownGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
