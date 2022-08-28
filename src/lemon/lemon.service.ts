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
      return error.message
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
      return error.message
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
      return error.message
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
      return error.message
    }
  }

  async getAccount(): Promise<any> {
    return this.getLemonTrading('/account')
  }

  async getPositions(): Promise<any> {
    return this.getLemonTrading('/positions')
  }

  async getLemonInstrument(ticker: string): Promise<any> {
    return this.getLemonData('/instruments', { search: ticker, type: 'stock' })
  }

  async placeBuyOrder(isin: string): Promise<any> {
    return this.postLemonTrading('/orders', {
      side: TradeSide.BUY,
      quantity: 1,
      isin,
      idempotency: `${isin}${TradeSide.BUY}`
    })
  }

  async activateOrder(orderId: string): Promise<any> {
    return this.postLemonTrading(`/orders/${orderId}/activate`)
  }

  async getOrders(): Promise<any> {
    return this.getLemonTrading('/orders')
  }

  async cancelOrder(orderId: string): Promise<any> {
    return this.deleteLemonTrading(`/orders/${orderId}`)
  }
}
