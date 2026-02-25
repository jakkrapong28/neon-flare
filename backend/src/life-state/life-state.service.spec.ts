import { Test, TestingModule } from '@nestjs/testing';
import { LifeStateService } from './life-state.service';

describe('LifeStateService', () => {
  let service: LifeStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifeStateService],
    }).compile();

    service = module.get<LifeStateService>(LifeStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
