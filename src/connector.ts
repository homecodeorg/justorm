import STORE from './store';
import { subscribe, unsubscribe } from './listeners';
import type { ProxyStore } from './proxy';
import type { StoreRegistry } from './store';

/**
 * Constructs a full path from a store name and a path.
 *
 * @param storeName - The name of the store or an array of store names.
 * @param path - The path.
 * @returns The full path.
 */
export function getFullPath(storeName: string, path?: string): string {
  if (!path) return storeName;

  // If storeName is an array, join the elements of the array and the path into a single string, separated by '.'
  // Filter out any empty strings before joining
  if (Array.isArray(storeName))
    return [...storeName, path].filter(Boolean).join('.');

  // If storeName is a string, return it joined with the path into a single string, separated by '.'
  return `${storeName}.${path}`;
}

/**
 * Connects a callback function to a store or a set of stores.
 *
 * @param storeName - The name of the store or an array of store names.
 * @param fields - An array of field names or a function.
 * @param cb - The callback function.
 */
export function connect(
  storeName: string,
  fields: string[] | Function,
  cb?: Function
) {
  // console.log('connect', storeName, fields, cb);

  if (typeof fields === 'function') {
    const store = STORE[storeName];
    // console.log('Store found:', store);

    if (!store) {
      console.warn(`Store ${storeName} does not exist`);
      return;
    }

    cb = fields;
    fields = Object.keys(store.toJS());
    // console.log('Fields:', fields);

    if (!fields || fields.length === 0) {
      console.warn(`Store ${storeName} has no fields`);
      return;
    }
  }

  if (!cb) {
    throw new Error('Callback function is required');
  }

  // console.log('Subscribing to fields:', fields);
  fields.forEach(field =>
    subscribe(getFullPath(storeName, field), cb as Function)
  );
  // console.log('Subscription complete');
}

/**
 * Unsubscribes a callback function from changes in specified fields of a store.
 *
 * @param storeName - The name of the store or an array of store names.
 * @param fields - An array of field names or a function.
 * @param cb - The callback function.
 */
export function disconnect(
  storeName: string,
  fields: string[] | Function,
  cb: Function
) {
  if (typeof fields === 'function') {
    cb = fields;
    fields = Object.keys(STORE[storeName]);
  }

  fields.forEach(field => unsubscribe(getFullPath(storeName, field), cb));
}

export type Config = string | string[] | Record<string, string | string[]>;

// Extract store names from config
type ExtractStoreNames<T> = T extends string
  ? T
  : T extends readonly string[]
  ? T[number]
  : T extends Record<string, any>
  ? keyof T
  : never;

// Get the type of a store from the StoreRegistry
type GetStoreType<StoreName extends string> =
  StoreName extends keyof StoreRegistry ? StoreRegistry[StoreName] : any;

// Map config to proper store types
export type InferStoreFromConfig<T extends Config> = T extends string
  ? { [K in T]: GetStoreType<K> }
  : T extends readonly string[]
  ? { [K in T[number]]: GetStoreType<K> }
  : T extends Record<string, any>
  ? { [K in keyof T]: GetStoreType<K & string> }
  : Record<string, any>;

type Entries = [string, string[]][];

/**
 * Retrieves the entries of a configuration object.
 *
 * @param config - The configuration object.
 * @returns An array of entries.
 *
 * @example: 'store1'
 * @example: ['store1', 'store2']
 * @example: {
 *  store2: 'field3',
 *  store1: ['field1', 'field2'],
 * }
 */
function getEntries(config: Config): Entries {
  if (Array.isArray(config)) return config.map(getEntries).flat();

  if (typeof config !== 'object') return [];

  return Object.entries(config).reduce((acc, [storeName, path]) => {
    if (typeof path === 'string') acc.push([path, []]);
    if (Array.isArray(path)) acc.push([storeName, path]);
    // TODO: support nested objects in store subscriptions
    // if (typeof path === 'object') acc.push(...getEntries(path as Config));
    return acc;
  }, [] as Entries);
}

export type StoreConnector<T extends Config = Config> = {
  store: InferStoreFromConfig<T>;
  connect: Function;
  disconnect: Function;
};

/**
 * Connects a callback function to a stores fields.
 *
 * @param config - The configuration object.
 * @param cb - The callback function.
 * @returns An object with the store and connect/disconnect methods.
 */
export default function connector<T extends Config>(
  config: T,
  cb: Function
): StoreConnector<T> {
  const entries = getEntries(config);

  // console.log('connector() entries -', entries);

  const store = entries.reduce(function (acc, s) {
    const name = s[0];
    return Object.assign(acc, { [name]: STORE[name] });
  }, {} as Record<string, any>);

  return {
    store: store as InferStoreFromConfig<T>,
    connect: function () {
      entries.forEach(([name, fields]) => connect(name, fields, cb));
    },
    disconnect: function () {
      entries.forEach(([name, fields]) => disconnect(name, fields, cb));
    },
  };
}
