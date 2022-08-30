export interface GetParams {
  [key: string]: string
}

// stock bot interfaces
export interface GetInstrumentBody {
  ticker: string
}

export interface PostTradeBody {
  ticker: string
  direction: TradeSide
  quantity: number
  auth: string
}

// lemon interfaces
export enum TradeSide {
  BUY = 'buy',
  SELL = 'sell'
}

export enum OrderStatus {
  INACTIVE = 'inactive',
  ACTIVATED = 'activated'
}
