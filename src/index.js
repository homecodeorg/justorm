var STORE = require('./store');
var LISTENERS = require('./listeners');

function createProxy(obj, onChange, path = []) {
  var store = new Proxy(obj, {
    get: function(target, prop) {
      var item = target[prop];

      if (typeof item === 'object') {
        return createProxy(item, onChange, path.concat([prop]));
      }

      if (typeof item === 'function') {
        return item.bind(store);
      }

      return item;
    },
    set: function(target, prop, newValue) {
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

export function createStore(storeName, obj) {
  function onChange(path) {
    LISTENERS.call([storeName].concat(path));
  };

  STORE[storeName] = createProxy(obj, onChange);

  return STORE[storeName];
}

export function connect(storeName, fields, cb) {
  fields.forEach(function (field) {
    LISTENERS.subscribe([storeName, field], cb);
  });
}

export function disconnect(storeName, fields, cb) {
  fields.forEach(field => {
    LISTENERS.unsubscribe([storeName, field], cb);
  });
}
