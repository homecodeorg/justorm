const nanoid = require('nanoid-esm/non-secure');

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

  STORE[storeName] = createProxy({
    obj,
    path: [storeName],
    disconnect,
  });

  connect();
  return STORE[storeName];
}
