import { InjectRepository } from '@nestjs/typeorm';
import {
  IsNull, Not, Repository,
} from 'typeorm';
import { ComputationModel, WishModel } from '../databases/postgresql/models';

export default class WishRepository {
  constructor(
    @InjectRepository(WishModel)
    private readonly wishesRepository: Repository<WishModel>,
  ) {
  }

  async findWaitingForComputation(): Promise<WishModel[]> {
    return this.wishesRepository.findBy({
      computation: IsNull(),
    });
  }

  async create(body: string) {
    return this.wishesRepository.save(this.wishesRepository.create({
      body,
    }));
  }

  async updateComputation(uuid: string, computation: ComputationModel) {
    return this.wishesRepository.update({
      uuid,
    }, {
      computation,
    });
  }

  async findById(uuid: string) {
    return this.wishesRepository.findOne({
      where: {
        uuid,
        computation: {
          powNonce: Not(IsNull()),
        },
      },
      relations: {
        computation: true,
      },
    });
  }
}
