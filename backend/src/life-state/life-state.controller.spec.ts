import { Test, TestingModule } from '@nestjs/testing';
import { LifeStateController } from './life-state.controller';

describe('LifeStateController', () => {
  let controller: LifeStateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifeStateController],
    }).compile();

    controller = module.get<LifeStateController>(LifeStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
