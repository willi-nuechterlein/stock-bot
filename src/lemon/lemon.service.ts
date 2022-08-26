import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class LemonService {
  constructor(private configService: ConfigService) {}

  private getLemonKey(): string {
    return this.configService.get<string>('LEMON_KEY')
  }

  private getLemonUrl(): string {
    return this.configService.get<string>('LEMON_URL')
  }

  private async getLemon(path: string): Promise<any> {
    try {
      const { data } = await axios.get(`${this.getLemonUrl()}${path}`, {
        headers: { Authorization: `Bearer ${this.getLemonKey()}` }
      })
      return data
    } catch (error) {
      Logger.error(error)
      return error.message
    }
  }

  async getAccount(): Promise<any> {
    return this.getLemon('/account')
  }

  async getPositions(): Promise<any> {
    return this.getLemon('/positions')
  }
}
