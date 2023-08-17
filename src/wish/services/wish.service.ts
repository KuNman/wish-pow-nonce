import {
  Inject, Injectable, Scope,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';
import { QueryFailedError } from 'typeorm';
import { WishModel } from '../../databases/postgresql/models';
import WishCreatedEvent from '../events/wish-created.event';
import WishRepository from '../wish.repository';
import { WishEventMetaType, WishEventsEnum } from '../wish.types';
import WishNotComputedException from '../exceptions/wish-not-computed.exception';
import WishNotCreatedException from '../exceptions/wish-not-created.exception';

@Injectable({
  scope: Scope.REQUEST,
})
export default class WishService {
  constructor(
    @Inject(WishRepository)
    private readonly wishRepository: WishRepository,
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2,
  ) {
  }

  async create(): Promise<WishModel> {
    try {
      const wish = await this.wishRepository.create('I wish you that systemd dies soon ...');

      // TODO: create generic layer for making metadata
      const meta: WishEventMetaType = {
        trace: uuidv4(), attempt: 1,
      };

      this.eventEmitter.emit(
        WishEventsEnum.created,
        new WishCreatedEvent(meta, wish),
      );

      return wish;
    } catch (e: unknown) {
      if (e instanceof QueryFailedError) {
        throw new WishNotCreatedException();
      }

      throw e;
    }
  }

  async check(uuid: string) {
    const wish = await this.wishRepository.findById(uuid);

    if (!wish) {
      throw new WishNotComputedException();
    }

    return wish;
  }
}
