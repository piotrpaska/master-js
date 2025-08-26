import { Test, TestingModule } from '@nestjs/testing';
import { StartListController } from './start-list.controller';

describe('StartListController', () => {
  let controller: StartListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StartListController],
    }).compile();

    controller = module.get<StartListController>(StartListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
