import { Test, TestingModule } from '@nestjs/testing'
import { LemonService } from './lemon.service'

describe('LemonService', () => {
  let service: LemonService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LemonService]
    }).compile()

    service = module.get<LemonService>(LemonService)
  })

  it.skip('should be defined', () => {
    expect(service).toBeDefined()
  })
})
