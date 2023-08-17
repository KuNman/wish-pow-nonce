import { WishEventMetaType } from '../../src/wish/wish.types';
import { WishModel } from '../../src/databases/postgresql/models';

export default class ComputationQueueServiceMock {
  readonly wishesQueue: Map<
  string,
  { meta: WishEventMetaType, wish: WishModel }
  > = new Map();

  computeWishes() {}
}
