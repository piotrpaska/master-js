import { Test, TestingModule } from '@nestjs/testing';
import { AppComGateway } from './app_com.gateway';

describe('AppComGateway', () => {
  let gateway: AppComGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppComGateway],
    }).compile();

    gateway = module.get<AppComGateway>(AppComGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
