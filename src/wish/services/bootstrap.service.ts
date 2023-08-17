import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';
import WishRepository from '../wish.repository';
import WishCreatedEvent from '../events/wish-created.event';
import { WishEventMetaType, WishEventsEnum } from '../wish.types';

export default class BootstrapService implements OnApplicationBootstrap {
  constructor(
    @Inject(WishRepository)
    private readonly wishesRepository: WishRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {
  }

  async onApplicationBootstrap() {
    const wishes = await this.wishesRepository.findWaitingForComputation();

    wishes.forEach((wish) => {
      // TODO: create generic layer for making metadata
      const meta: WishEventMetaType = {
        trace: uuidv4(), attempt: 1,
      };

      this.eventEmitter.emit(
        WishEventsEnum.created,
        new WishCreatedEvent(meta, wish),
      );
    });
  }
}
