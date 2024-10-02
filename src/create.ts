import { nanoid } from 'nanoid';

import { createProxy } from './proxy';
import type { ProxyStore } from './proxy';
import connector from './connector';
import STORE from './store';

export type Store = {
  [key: string]: any;
};

export function createStore<T extends object>(
  storeName: string,
  obj: T
): ProxyStore<T> {
  const store = createProxy({
    obj,
    path: storeName,
    // TODO: disconnect?
  });

  STORE[storeName] = store;

  return store;
}

export function createConnectedStore<T extends object>(
  obj: T,
  cb: Function
): ProxyStore<T> {
  const storeName = nanoid();
  const { connect, disconnect } = connector(storeName, cb);

  STORE[storeName] = createProxy({
    obj,
    path: storeName,
    disconnect,
  });

  connect();
  return STORE[storeName];
}
