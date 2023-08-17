import { Exclude, Expose } from 'class-transformer';
import { WishModel } from '../../../databases/postgresql/models';

@Exclude()
export default class PutWishDto {
  constructor(partial: Partial<WishModel>) {
    Object.assign(this, partial);
  }

  @Expose()
    uuid: string;

  @Expose()
    createdAt: Date;
}
