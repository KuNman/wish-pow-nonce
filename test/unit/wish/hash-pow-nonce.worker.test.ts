import { v4 as uuidv4 } from 'uuid';
import calcHash from '../../../src/wish/workers/hash-pow-nonce.worker';
import { HashPowNonceWorkerResponse } from '../../../src/wish/wish.types';

jest.mock('node:worker_threads', () => ({
  parentPort: {
    on: jest.fn(),
  },
}));

describe('HashPowNonceWorker', () => {
  it('returns correct object', async () => {
    const uuid = uuidv4();
    const res: HashPowNonceWorkerResponse = await calcHash(uuid, 2);

    expect(res.uuid)
      .toEqual(uuid);
    expect(res.powNonce)
      .toEqual(expect.any(Number));
    expect(typeof res.hash)
      .toBe('string');
  }, 30000);

  it('returns hash starting with 00', async () => {
    const res: HashPowNonceWorkerResponse = await calcHash(uuidv4(), 2);

    expect(res.hash.startsWith('00'))
      .toBeTruthy();
  }, 30000);

  it.skip('rejects if free memory is less than 250mb', async () => {
    // TODO: implement
  });
});
