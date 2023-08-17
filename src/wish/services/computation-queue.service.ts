import { Worker } from 'worker_threads';
import * as path from 'path';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Inject, Injectable, Logger, Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ComputationModel, WishModel } from '../../databases/postgresql/models';
import WishRepository from '../wish.repository';
import {
  WishEventMetaType, WishEventsEnum, HashPowNonceWorkerResponse,
} from '../wish.types';
import WishFailedEvent from '../events/wish-failed.event';
import WishComputedEvent from '../events/wish-computed.event';
import HashPowNonceResponseException from '../exceptions/hash-pow-nonce-response.exception';

@Injectable({
  scope: Scope.DEFAULT,
})
export default class ComputationQueueService {
  private readonly logger = new Logger(this.constructor.name);

  readonly wishesQueue: Map<
  string,
  { meta: WishEventMetaType, wish: WishModel }
  > = new Map();

  private readonly computations: Set<Promise<string>> = new Set();

  private runningWorkers = 0;

  private maxWorkers = Number(this.configService.get<string>('WISH_MAX_WORKERS'));

  constructor(
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(ComputationModel)
    private readonly computationModelRepository: Repository<ComputationModel>,
    @Inject(WishRepository)
    private readonly wishRepository: WishRepository,
    @Inject(ConfigService)
    protected readonly configService: ConfigService,
  ) {
  }

  getRunningWorkers() {
    return this.runningWorkers;
  }

  setRunningWorkers(amount: number) {
    this.runningWorkers = amount;

    return this;
  }

  assertWorkerResponse(result: HashPowNonceWorkerResponse): asserts result is HashPowNonceWorkerResponse {
    // TODO: improve validation
    if (!result.powNonce || !result.uuid || !result.hash) {
      throw new HashPowNonceResponseException();
    }
  }

  private async handleWorkerCommunication(
    worker: Worker,
    payload: { meta: WishEventMetaType, wish: WishModel, computation: ComputationModel },
  ) {
    const { computation, meta, wish } = payload;
    worker.on('message', async (result: HashPowNonceWorkerResponse) => {
      this.assertWorkerResponse(result);
      await worker.terminate();

      await this.computationModelRepository.update({
        id: payload.computation.id,
      }, {
        powNonce: result.powNonce,
        hash: result.hash,
      });

      await this.wishRepository.updateComputation(result.uuid, computation);

      this.setRunningWorkers(this.getRunningWorkers() - 1);

      this.eventEmitter.emit(
        WishEventsEnum.computed,
        new WishComputedEvent(),
      );
    });

    worker.on('error', (err) => {
      this.eventEmitter.emit(
        WishEventsEnum.failed,
        new WishFailedEvent(meta, wish, err),
      );
    });

    worker.postMessage(payload.wish.uuid);
  }

  private pickupWishesFromQueue() {
    this.wishesQueue.forEach(({ meta, wish }, key) => {
      if (this.maxWorkers >= this.getRunningWorkers()) {
        const promise: Promise<string> = new Promise(() => {
          // TODO: balance amount of workers assigned to one wish,
          //  eg. for wishes.size = 1, assign 1/2 of available workers
          const worker = new Worker(path.resolve(__dirname, '../workers/hash-pow-nonce.worker.js'));
          this.setRunningWorkers(this.getRunningWorkers() + 1);

          this.wishesQueue.delete(key);

          this.computationModelRepository.save(
            this.computationModelRepository.create(),
          )
            .then((computation) => {
              this.handleWorkerCommunication(worker, {
                meta, wish, computation,
              })
                .catch((err) => {
                  this.eventEmitter.emit(
                    WishEventsEnum.failed,
                    new WishFailedEvent(meta, wish, err),
                  );
                });
            });
        });

        this.computations.add(promise);
      }
    });
  }

  private countAvailableWorkers() {
    return this.getRunningWorkers() < this.maxWorkers
      ? this.maxWorkers - this.getRunningWorkers()
      : null;
  }

  async computeWishes() {
    const availableWorkers = this.countAvailableWorkers();

    if (!availableWorkers) {
      this.logger.warn('Wish workers overloaded');

      return;
    }

    this.pickupWishesFromQueue();
    await Promise.all(this.computations);
  }
}
