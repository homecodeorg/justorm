import type { ProxyStore } from './proxy';

// Global store type registry - users can augment this interface
export interface StoreRegistry {
  // This will be augmented by createStore calls
}

interface StoreType {
  [key: string]: ProxyStore<any>; // Store proxied objects
}

let STORE: StoreType = {};
// TODO:
// 1) create set/get
// 2) compare values with+ initials
if (
  typeof window !== 'undefined' &&
  (location.hostname === 'localhost' || location.search.includes('__justorm__'))
) {
  let f = '__justorm__';
  // @ts-ignore
  if (!window[f]) window[f] = {};
  // @ts-ignore
  STORE = window[f];
}

export default STORE;
