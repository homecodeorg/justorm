import { createProxy } from './proxy';
import type { ProxyStore } from './proxy';
import connector from './connector';
import STORE from './store';
import { generateId } from './id';

export type Store = {
  [key: string]: any;
};

// Helper type to create the final store shape
type StoreMethodContext<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : T[K];
};

// Utility type for creating stores with proper 'this' context
export type StoreDefinition<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => infer Return
    ? (this: StoreMethodContext<T>, ...args: Args) => Return
    : T[K];
};

// The final store shape that users get back
export type StoreShape<T> = StoreDefinition<T>;

// Utility type to get the shape of the store
export type InferStoreType<T> = T extends Record<string, any>
  ? StoreShape<T>
  : never;

export function createStore<T extends Record<string, any>>(
  storeName: string,
  obj: StoreDefinition<T>
): ProxyStore<StoreShape<T>> {
  const store = createProxy({
    obj: obj as StoreShape<T>,
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
  const storeName = generateId();
  const { connect, disconnect } = connector(storeName, cb);

  STORE[storeName] = createProxy({
    obj,
    path: storeName,
    disconnect,
  });

  connect();
  return STORE[storeName];
}
