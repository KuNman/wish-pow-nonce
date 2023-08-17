type WishEventMetaType = {
  trace: string,
  attempt: number
};

enum WishEventsEnum {
  'created' = 'wish.created',
  'computed' = 'wish.computed',
  'failed' = 'wish.failed',
}

type HashPowNonceWorkerResponse = {
  powNonce: number,
  uuid: string,
  hash: string
};

export {
  WishEventMetaType, WishEventsEnum, HashPowNonceWorkerResponse,
};
