import { subscribe, unsubscribe, call } from './tools/listeners';

export const STORE = {};

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

function getOriginalObject(obj) {
  if (Array.isArray(obj)) return obj.map(getOriginalObject);

  if (isObject(obj)) {
    return Object.entries(obj).reduce((acc, [field, val]) => {
      if (val && val.originalObject) acc[field] = val.originalObject;
      return acc;
    }, obj);
  }

  return obj;
}

function createProxy(obj, onChange, path = []) {
  var store = new Proxy(obj, {
    get: function (target, prop) {
      if (prop === 'proxy') {
        const itemProxy = target[prop];

        if (isObject(itemProxy)) {
          return createProxy(itemProxy, onChange, path.concat([prop]));
        }

        return target[prop];
      }

      var item = obj[prop];

      if (typeof item === 'function') {
        return item.bind(store);
      }

      return item;
    },
    set: function (target, prop, newValue) {
      if (typeof target[prop] === 'function') {
        console.warn('Changing store actions is prohibited');
        return false;
      }

      target[prop] = newValue;
      onChange(path.concat([prop]));

      return true;
    },
  });

  return store;
}

function createLocalStore(instance, obj) {
  return createProxy(obj, () => instance.setState({ _justorm: Date.now() }));
}

function createSharedStore(storeName, obj) {
  function onChange(path) {
    call([storeName].concat(path));
  }

  STORE[storeName] = createProxy(obj, onChange);

  return STORE[storeName];
}

export function createStore(src, obj) {
  if (src.setState) return createLocalStore(src, obj);
  return createSharedStore(src, obj);
}

function getFields(storeName, fields) {
  if (Array.isArray(fields) && fields.length > 0) return fields;
  return Object.keys(STORE[storeName]);
}

export function connect(storeName, fields, cb) {
  if (typeof fields === 'function') cb = fields;

  getFields(storeName, fields).forEach(field =>
    subscribe([storeName, field], cb)
  );
}

export function disconnect(storeName, fields, cb) {
  if (typeof fields === 'function') cb = fields;

  getFields(storeName, fields).forEach(field =>
    unsubscribe([storeName, field], cb)
  );
}
