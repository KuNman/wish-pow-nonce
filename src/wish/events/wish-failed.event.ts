import { WishEventMetaType } from '../wish.types';
import { WishModel } from '../../databases/postgresql/models';

export default class WishFailedEvent {
  constructor(meta: WishEventMetaType, wish: WishModel, error: Error) {
    Object.assign(this, {
      meta, wish, error,
    });
  }

  meta: WishEventMetaType;

  wish: WishModel;

  error: Error;
}
