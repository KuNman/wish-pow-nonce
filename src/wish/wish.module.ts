import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import WishController from './wish.controller';
import WishService from './services/wish.service';
import { ComputationModel, WishModel } from '../databases/postgresql/models';
import ComputationQueueService from './services/computation-queue.service';
import WishRepository from './wish.repository';
import BootstrapService from './services/bootstrap.service';
import WishCreatedHandler from './handlers/wish-created.handler';
import WishComputedHandler from './handlers/wish-computed.handler';
import WishFailedHandler from './handlers/wish-failed.handler';
import envValidator from './validators/env.validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: envValidator,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TypeOrmModule.forFeature([
      WishModel,
      ComputationModel,
    ]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [WishController],
  providers: [
    WishService,
    ComputationQueueService,
    BootstrapService,
    WishRepository,
    WishCreatedHandler,
    WishComputedHandler,
    WishFailedHandler,
  ],
})

export default class WishModule {}
