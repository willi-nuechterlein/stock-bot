import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP')

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req
    const body = JSON.stringify(req.body)
    res.on('finish', () => {
      const { statusCode } = res

      this.logger.log(
        `${method} ${originalUrl} status:${statusCode} body:${body} - IP:${ip}`
      )
    })

    next()
  }
}
