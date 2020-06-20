import nanoid from 'nanoid-esm';

import { createProxy } from './proxy';
import connector from './connector';
import STORE from './store';

export function createStore(storeName, obj) {
  return (STORE[storeName] = createProxy({
    obj,
    path: [storeName],
  }));
}

export function createConnectedStore(obj, cb) {
  const storeName = nanoid();
  const { connect, disconnect } = connector(storeName, cb);

  connect();
  return createProxy({
    obj,
    path: [storeName],
    disconnect,
  });
}
