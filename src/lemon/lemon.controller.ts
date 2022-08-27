import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query
} from '@nestjs/common'
import isin from 'src/utils/mapTickerToIsin'
import { GetInstrumentBody, PostTradeBody } from './interfaces/lemon.interface'
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

  @Get('/instrument')
  getInstruments(@Query() query: GetInstrumentBody): any {
    const { ticker } = query
    if (ticker) {
      return this.lemonService.getLemonInstrument(ticker)
    } else {
      throw new BadRequestException()
    }
  }

  @Post('/trade')
  async trade(@Body() body: PostTradeBody): Promise<any> {
    const { ticker } = body
    const isinString = isin[ticker]
    const { id } = await this.lemonService.placeBuyOrder(isinString)
    if (id) {
      const { status } = await this.lemonService.activateOrder(id)
      if (status === 'ok') {
        return 'Order active'
      } else {
        throw new BadRequestException()
      }
    }
    throw new BadRequestException()
  }
}
