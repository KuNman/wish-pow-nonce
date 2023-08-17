import { OnEvent } from '@nestjs/event-emitter';
import { Inject } from '@nestjs/common';
import WishCreatedEvent from '../events/wish-created.event';
import ComputationQueueService from '../services/computation-queue.service';
import { WishEventsEnum } from '../wish.types';

export default class WishCreatedHandler {
  constructor(
    @Inject(ComputationQueueService) private readonly eventService: ComputationQueueService,
  ) {
  }

  @OnEvent(WishEventsEnum.created)
  async listenToCreatedEvent(event: WishCreatedEvent) {
    this.eventService.wishesQueue.set(event.wish.uuid, event);

    await this.eventService.computeWishes();
  }
}
