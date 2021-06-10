import compare from 'compareq';
import nanoid from 'nanoid-esm';

import STORE from './store';
import { call } from './listeners';
import connector, { getFullPath } from './connector';

let QUEUE = [];
let queueTimeout;

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

function callBatchUpdate() {
  if (queueTimeout) return;

  queueTimeout = setTimeout(() => {
    const id = nanoid();
    const queue = QUEUE.slice(0);

    QUEUE = [];
    queueTimeout = null;
    queue.forEach(fullPath => call(fullPath, id));
  }, 0);
}

function batchedUpdate(fullPath, onChange) {
  QUEUE.push(fullPath);
  callBatchUpdate();
}

export function createProxy({ obj, path = [], disconnect }) {
  const store = new Proxy(obj, {
    get: function (target, prop) {
      if (prop === 'originalObject') return obj;
      if (prop === 'plain') return () => obj;
      if (disconnect && prop === 'disconnect') return disconnect;

      const item = obj[prop];

      if (isObject(item))
        return createProxy({
          obj: item,
          path: getFullPath(path, prop),
        });

      if (typeof item === 'function') return item.bind(store);
      return item;
    },
    set: function (target, prop, value) {
      if (typeof target[prop] === 'function') {
        console.warn('Changing store actions is prohibited');
        return false;
      }

      if (compare(target[prop], value)) return true;

      const fullPath = getFullPath(path, prop);

      batchedUpdate(fullPath);
      target[prop] = value;

      return true;
    },
  });

  return store;
}
