import { OnEvent } from '@nestjs/event-emitter';
import { Inject } from '@nestjs/common';
import ComputationQueueService from '../services/computation-queue.service';
import { WishEventsEnum } from '../wish.types';

export default class WishComputedHandler {
  constructor(
    @Inject(ComputationQueueService) private readonly eventService: ComputationQueueService,
  ) {
  }

  @OnEvent(WishEventsEnum.computed, {
    async: true,
  })
  async listenToComputedEvent() {
    await this.eventService.computeWishes();
  }
}
