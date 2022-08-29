import { Module } from '@nestjs/common'
import { LemonController } from './lemon.controller'
import { LemonService } from './lemon.service'

@Module({
  controllers: [LemonController],
  providers: [LemonService],
  exports: [LemonService]
})
export class LemonModule {}
