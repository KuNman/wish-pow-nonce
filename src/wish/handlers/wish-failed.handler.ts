import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Inject, Logger } from '@nestjs/common';
import { WishEventsEnum } from '../wish.types';
import WishFailedEvent from '../events/wish-failed.event';
import WishCreatedEvent from '../events/wish-created.event';
import ComputationQueueService from '../services/computation-queue.service';

export default class WishFailedHandler {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2,
    @Inject(ComputationQueueService) private readonly eventService: ComputationQueueService,
  ) {
  }

  @OnEvent(WishEventsEnum.failed)
  listenToCreatedEvent(event: WishFailedEvent) {
    this.eventService.setRunningWorkers(this.eventService.getRunningWorkers() - 1);

    if (event.meta.attempt >= 3) {
      throw new Error(`wish ${event.wish.uuid} failed with error ${event.error} after ${event.meta.attempt} attemps, take action`);
    }

    this.logger.error(`wish ${event.wish.uuid} failed with error ${event.error}, retrying`);

    this.eventEmitter.emit(
      WishEventsEnum.created,
      new WishCreatedEvent(Object.assign(event.meta, {
        attempt: event.meta.attempt + 1,
      }), event.wish),
    );
  }
}
