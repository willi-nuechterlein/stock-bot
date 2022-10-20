import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { GetParams, TradeSide } from './interfaces/lemon.interface'

@Injectable()
export class LemonService {
  constructor(private configService: ConfigService) {}

  private getLemonKey(): string {
    return this.configService.get<string>('LEMON_KEY')
  }

  private getLemonDataKey(): string {
    return this.configService.get<string>('LEMON_KEY_DATA')
  }

  private getLemonTradingUrl(): string {
    return this.configService.get<string>('LEMON_URL_TRADING')
  }

  private getLemonDataUrl(): string {
    return this.configService.get<string>('LEMON_URL_DATA')
  }

  private async getLemonTrading(
    path: string,
    params: GetParams = null
  ): Promise<any> {
    try {
      const { data } = await axios.get(`${this.getLemonTradingUrl()}${path}`, {
        headers: { Authorization: `Bearer ${this.getLemonKey()}` },
        params: params
      })
      return data
    } catch (error) {
      Logger.error(error)
      Logger.error(error.response.data)
      Logger.error(error.response.headers)
      return error.response.data
    }
  }

  private async getLemonData(
    path: string,
    params: GetParams = null
  ): Promise<any> {
    try {
      const { data } = await axios.get(`${this.getLemonDataUrl()}${path}`, {
        headers: { Authorization: `Bearer ${this.getLemonDataKey()}` },
        params: params
      })
      return data
    } catch (error) {
      Logger.error(error)
      Logger.error(error.response.data)
      Logger.error(error.response.headers)
      return error.response.data
    }
  }

  private async postLemonTrading(path: string, body?: any): Promise<any> {
    try {
      const { data } = await axios({
        method: 'POST',
        url: `${this.getLemonTradingUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.getLemonKey()}`,
          'Content-Type': 'application/json; charset=utf-8'
        },
        data: body
      })
      return data
    } catch (error) {
      Logger.error(error)
      Logger.error(error.response.data)
      Logger.error(error.response.headers)
      return error.response.data
    }
  }

  private async deleteLemonTrading(path: string): Promise<any> {
    try {
      const { data } = await axios({
        method: 'DELETE',
        url: `${this.getLemonTradingUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.getLemonKey()}`
        }
      })
      return data
    } catch (error) {
      Logger.error(error)
      return error.response.data
    }
  }

  async getAccount(): Promise<any> {
    return this.getLemonTrading('/account')
  }

  async getPositions(): Promise<any> {
    return this.getLemonTrading('/positions')
  }

  async getStatements(): Promise<any> {
    return this.getLemonTrading('/positions/statements')
  }

  async getPerformance(): Promise<any> {
    return this.getLemonTrading('/positions/performance')
  }

  async getBankstatements(): Promise<any> {
    return this.getLemonTrading('/account/bankstatements')
  }

  async getLemonInstrument(ticker: string): Promise<any> {
    return this.getLemonData('/instruments', { search: ticker, type: 'stock' })
  }

  async placeBuyOrder(isin: string, quantity: number): Promise<any> {
    return this.postLemonTrading('/orders', {
      side: TradeSide.BUY,
      expires_at: '2d',
      quantity,
      isin
      // idempotency: `${isin}${TradeSide.BUY}`
    })
  }

  async placeSellOrder(isin: string, quantity: number): Promise<any> {
    return this.postLemonTrading('/orders', {
      side: TradeSide.SELL,
      expires_at: '2d',
      quantity,
      isin
      // idempotency: `${isin}${TradeSide.SELL}`
    })
  }

  async activateOrder(orderId: string): Promise<any> {
    return this.postLemonTrading(`/orders/${orderId}/activate`)
  }

  async getOrders(params?: GetParams): Promise<any> {
    return this.getLemonTrading('/orders', params)
  }

  async cancelOrder(orderId: string): Promise<any> {
    return this.deleteLemonTrading(`/orders/${orderId}`)
  }
}
