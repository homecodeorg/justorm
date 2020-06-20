import STORE from './store';
import { subscribe, unsubscribe } from './listeners';

function getFields(storeName, fields) {
  if (Array.isArray(fields) && fields.length > 0) return fields;
  return Object.keys(STORE[storeName]);
}

export function getFullPath(storeName, path) {
  if (!storeName) return path;
  if (Array.isArray(storeName))
    return [...storeName, path].filter(Boolean).join('.');
  return `${storeName}.${path}`;
}

export function connect(storeName, fields, cb) {
  if (typeof fields === 'function') cb = fields;

  getFields(storeName, fields).forEach(field =>
    subscribe(getFullPath(storeName, field), cb)
  );
}

export function disconnect(storeName, fields, cb) {
  if (typeof fields === 'function') cb = fields;

  getFields(storeName, fields).forEach(field =>
    unsubscribe(getFullPath(storeName, field), cb)
  );
}

function getEntries(config) {
  if (typeof config === 'string') return [[config]];
  if (Array.isArray(config)) {
    return config.reduce((acc, item) => {
      if (typeof item === 'string') acc.push([item]);
      if (typeof item === 'object') acc.push(...Object.entries(item));
      return acc;
    }, []);
  }
  return Object.entries(config);
}

export default function connector(config, cb) {
  const entries = getEntries(config);
  const store = entries.reduce(function (acc, s) {
    const name = s[0];
    return Object.assign(acc, { [name]: STORE[name] });
  }, {});

  return {
    store,
    connect: function () {
      entries.forEach(([name, fields]) => connect(name, fields, cb));
    },
    disconnect: function () {
      entries.forEach(([name, fields]) => disconnect(name, fields, cb));
    },
  };
}
