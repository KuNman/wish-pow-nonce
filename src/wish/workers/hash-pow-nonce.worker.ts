import { createHash, webcrypto } from 'node:crypto';
import { parentPort } from 'node:worker_threads';
import { mem } from 'node-os-utils';
import { HashPowNonceWorkerResponse } from '../wish.types';

export default function calcHash(uuid: string, timeout = 100) {
  return new Promise<HashPowNonceWorkerResponse>((resolve, reject) => {
    const interval = setInterval(() => {
      mem.free()
        .then((res) => {
          if (res.freeMemMb < 250) {
            reject(new Error('insufficient memory'));
          }

          const randomInt = webcrypto.getRandomValues(new Uint16Array(1))
            .at(0);

          const hash = createHash('sha256')
            .update(JSON.stringify({
              uuid, powNonce: randomInt,
            }))
            .digest('hex');

          if (hash.startsWith('00')) {
            clearInterval(interval);
            resolve({
              powNonce: randomInt,
              uuid,
              hash,
            });
          }
        });
      // TODO: implement logic for changing timeout interval based on conditions
    }, timeout);
  });
}

parentPort.on('message', async (data) => {
  parentPort.postMessage(await calcHash(data));
});
