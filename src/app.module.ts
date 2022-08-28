import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { HttpModule, HttpService } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LemonModule } from './lemon/lemon.module'
import { RequestLoggingMiddleware } from './middleware/request-logging.middleware'

@Module({
  imports: [
    HttpModule,
    LemonModule,
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  constructor(private httpService: HttpService) {}
  onModuleInit() {
    this.httpService.axiosRef.interceptors.request.use((config) => {
      Logger.log(config)
      return config
    })
  }
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*')
  }
}
