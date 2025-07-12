import { Test, TestingModule } from '@nestjs/testing';
import { StartSequenceController } from './start_sequence.controller';

describe('StartSequenceController', () => {
  let controller: StartSequenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StartSequenceController],
    }).compile();

    controller = module.get<StartSequenceController>(StartSequenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
