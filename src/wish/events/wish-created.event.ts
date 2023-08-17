import { WishModel } from '../../databases/postgresql/models';
import { WishEventMetaType } from '../wish.types';

export default class WishCreatedEvent {
  constructor(meta: WishEventMetaType, wish: WishModel) {
    Object.assign(this, {
      meta, wish,
    });
  }

  meta: WishEventMetaType;

  wish: WishModel;
}
