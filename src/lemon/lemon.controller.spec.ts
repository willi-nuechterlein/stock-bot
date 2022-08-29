import { Test, TestingModule } from '@nestjs/testing'
import { LemonController } from './lemon.controller'

describe('LemonController', () => {
  let controller: LemonController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LemonController]
    }).compile()

    controller = module.get<LemonController>(LemonController)
  })

  it.skip('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
