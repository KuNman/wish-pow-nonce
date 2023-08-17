import {
  Exclude, Expose, Transform,
} from 'class-transformer';
import { ComputationModel, WishModel } from '../../../databases/postgresql/models';

@Exclude()
export default class GetWishDto {
  constructor(partial: Partial<WishModel>) {
    Object.assign(this, partial);
  }

  @Expose()
    uuid: string;

  @Expose()
    body: string;

  @Transform(({ obj: { computation: { powNonce, createdAt, updatedAt, hash } } }) => ({
    powNonce,
    createdAt,
    finishedAt: updatedAt,
    time: `~${Math.round(Math.abs(createdAt - updatedAt) / 1000)}s`,
    hash,
  }))
  @Expose()
    computation: Pick<ComputationModel, 'powNonce' | 'createdAt' | 'updatedAt' | 'hash'>;
}
