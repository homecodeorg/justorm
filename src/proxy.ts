import compare from 'compareq';

import { call } from './listeners';
import { getFullPath } from './connector';
import { generateId } from './id';

function isObject(obj: any) {
  return typeof obj === 'object' && obj !== null;
}

let QUEUE: string[] = [];
let queueTimeout: NodeJS.Timeout | null = null;

/**
 * Run all queued updates in the next tick.
 * @returns
 */
function callBatchUpdate() {
  if (queueTimeout) return;

  queueTimeout = setTimeout(() => {
    const id = generateId();
    const queue = QUEUE.slice(0); // copy the queue

    QUEUE = [];
    queueTimeout = null;
    queue.forEach(fullPath => call(fullPath, id));
  }, 0);
}

/**
 * Add field to the updates queue.
 * @param fullPath
 * @param onChange
 */
function batchedUpdate(fullPath: string, onChange?: Function) {
  QUEUE.push(fullPath);
  callBatchUpdate();
}

export interface ProxyOptions<T> {
  obj: T;
  path?: string;
  disconnect?: Function;
}

export type ProxyStore<T> = T & {
  toJS: () => T;
  disconnect: Function;
};

function isReflected(value: any) {
  return [Set, Map].some(c => value instanceof c);
}

type HandlerArgs<T> = [T, string, any];

export function createProxy<T>({
  obj,
  path = '',
  disconnect,
}: ProxyOptions<T>): ProxyStore<T> {
  const proxiedMaps = new WeakMap(); // WeakMap - to avoid memory leaks

  // @ts-ignore
  const store = new Proxy<T>(obj, {
    /**
     * Catch all get calls to the store object.
     */
    get: function (...args: HandlerArgs<typeof obj>) {
      const [target, prop] = args;

      switch (prop) {
        case 'toJS':
          return () => obj;
        case 'originalObject':
          return obj;
        case 'disconnect':
          if (disconnect) return disconnect;
      }

      // @ts-ignore
      let currFieldValue = obj[prop];
      const isValueReflected = isReflected(currFieldValue);

      if (typeof currFieldValue === 'function') {
        const isMap = target instanceof Map;
        const isMapSet = isMap && prop === 'set';
        const isSetAdd = target instanceof Set && prop === 'add';

        // handling Map/Set methods
        if ((isValueReflected && prop === 'delete') || isMapSet || isSetAdd) {
          // @ts-ignore
          return (...methodArgs) => {
            // @ts-ignore
            const res = target[prop](...methodArgs);
            // call update with path of the map/set
            batchedUpdate(getFullPath(path));
            // do not wrap Map/Set values with a proxy
            return res;
          };
        }

        return currFieldValue.bind(store);
      }

      if (isObject(currFieldValue)) {
        // @ts-ignore
        const value = isValueReflected ? Reflect.get(...args) : currFieldValue;

        if (isValueReflected) {
          currFieldValue = value;
        }

        if (!proxiedMaps.get(value)) {
          proxiedMaps.set(
            value,
            createProxy({
              obj: currFieldValue,
              path: getFullPath(path, prop),
              disconnect,
            })
          );
        }

        // always return the proxy for objects
        return proxiedMaps.get(value);
      }

      return currFieldValue;
    },

    /**
     * Catch all set calls to the store object.
     */
    set: function (target: any, prop: string, value: any) {
      const prevValue = target[prop];

      // if (isReflected(target)) debugger;

      if (typeof prevValue === 'function') {
        console.error('Changing a store actions is prohibited');
        return false;
      }

      // if the value is the same - do nothing
      if (!compare(prevValue, value)) {
        const fullPath = getFullPath(path, prop);

        batchedUpdate(fullPath);
        target[prop] = value;
      }

      return true;
    },
  });

  // @ts-ignore
  return store;
}
