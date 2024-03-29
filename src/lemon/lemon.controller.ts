import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import isin from '../utils/mapTickerToIsin'
import {
  GetInstrumentBody,
  OrderStatus,
  PostTradeBody,
  TradeSide
} from './interfaces/lemon.interface'
import { LemonService } from './lemon.service'

@Controller('lemon')
export class LemonController {
  constructor(
    private readonly lemonService: LemonService,
    private configService: ConfigService
  ) {}

  @Get('/account')
  getAccount(): any {
    return this.lemonService.getAccount()
  }

  @Get('/positions')
  getPositions(): any {
    return this.lemonService.getPositions()
  }

  @Get('/performance')
  getPerformance(): any {
    return this.lemonService.getPerformance()
  }

  @Get('/statements')
  getStatements(): any {
    return this.lemonService.getStatements()
  }

  @Get('/bankstatements')
  getBankStatements(): any {
    return this.lemonService.getBankstatements()
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
    const {
      ticker: tickerReq,
      direction: directionReq,
      quantity: quantityReq,
      auth
    } = body
    if (!tickerReq || !directionReq || !quantityReq) {
      throw new BadRequestException()
    }
    if (auth !== this.configService.get<string>('BOT_PASSPHRASE')) {
      throw new UnauthorizedException()
    }
    const ticker = tickerReq.trim()
    const direction = directionReq.trim()
    const quantity = Math.abs(quantityReq)
    const isinString = isin[ticker]

    let results
    if (direction === TradeSide.BUY) {
      const order = await this.lemonService.placeBuyOrder(
        isinString,
        Number(quantity)
      )
      results = order.results
    }
    if (direction === TradeSide.SELL) {
      // check if order exisists for isin
      const orders = await this.lemonService.getOrders({
        status: [OrderStatus.ACTIVATED, OrderStatus.INACTIVE].join(','),
        side: TradeSide.BUY,
        isin: isinString
      })
      if (orders.status === 'error') {
        throw new BadRequestException()
      }
      // if order exists cancel instead of selling
      if (orders.results.length > 0) {
        const response = await this.lemonService.cancelOrder(
          orders.results[0].id
        )
        if (response.status === 'error') {
          throw new BadRequestException()
        }
        return 'buy order canceled - due to sell trade'
      }
      const order = await this.lemonService.placeSellOrder(
        isinString,
        Number(quantity)
      )
      if (order.status === 'error') {
        throw new BadRequestException()
      }
      results = order.results
    }
    if (results?.id) {
      const { status } = await this.lemonService.activateOrder(results.id)
      if (status === 'ok') {
        return `${direction} order active`
      } else {
        throw new BadRequestException()
      }
    }
  }

  @Delete('/orders/:id')
  deleteOrder(@Param('id') id: string): any {
    return this.lemonService.cancelOrder(id)
  }
}
