import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
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

  @Get('/orders')
  getOrders(): any {
    return this.lemonService.getOrders()
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
    const { results } = await this.lemonService.placeBuyOrder(isinString)
    if (results?.id) {
      const { status } = await this.lemonService.activateOrder(results.id)
      if (status === 'ok') {
        return 'Order active'
      } else {
        throw new BadRequestException()
      }
    }
    throw new BadRequestException()
  }

  @Delete('/orders/:id')
  deleteOrder(@Param('id') id: string): any {
    return this.lemonService.cancelOrder(id)
  }
}
