var get = require('./tools/get');
var set = require('./tools/set');

var LISTENERS = {};

function subscribe(path, cb) {
  var currListeners = get(LISTENERS, path);

  if (!currListeners) {
    set(LISTENERS, path, [cb]);
    return;
  }

  if (currListeners.indexOf(cb) === -1) currListeners.push(cb);
}

function unsubscribe(path, cb) {
  var currListeners = get(LISTENERS, path);

  if (!currListeners) return;

  var index = currListeners.indexOf(cb);

  if (index === -1) return;

  set(
    LISTENERS,
    path,
    LISTENERS.slice(0, index).concat(LISTENERS.slice(index + 1))
  );
}

function call(path) {
  for (var i = 1; i <= path.length; i++) {
    var listeners = get(LISTENERS, path.slice(0, i));

    if (Array.isArray(listeners)) {
      listeners.forEach(function (cb) { cb() });
      return;
    }
  }
}

module.exports = {
  subscribe: subscribe,
  unsubscribe: unsubscribe,
  call: call
}
