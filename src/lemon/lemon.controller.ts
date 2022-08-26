import { Controller, Get } from '@nestjs/common'
import { LemonService } from './lemon.service'

@Controller('lemon')
export class LemonController {
  constructor(private readonly lemonService: LemonService) {}

  @Get('/account')
  getAccount(): any {
    return this.lemonService.getAccount()
  }

  @Get('/positions')
  getPositions(): any {
    return this.lemonService.getPositions()
  }
}
