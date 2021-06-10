const LISTENERS = {};

export function subscribe(path, cb) {
  const currListeners = LISTENERS[path];

  if (!currListeners) {
    LISTENERS[path] = [cb];
    return;
  }

  if (currListeners.indexOf(cb) === -1) currListeners.push(cb);
}

export function unsubscribe(path, cb) {
  const currListeners = LISTENERS[path];

  if (!currListeners) return;

  const index = currListeners.indexOf(cb);

  if (index === -1) return;

  const newListeners = currListeners
    .slice(0, index)
    .concat(currListeners.slice(index + 1));

  LISTENERS[path] = newListeners;
}

const Callbacks = {
  stack: [],
  init(id) {
    if (id === this.id) return;
    this.id = id;
    this.stack = [];
  },
  add(cb) {
    if (this.has(cb)) return;
    this.stack.push(cb);
  },
  has(cb) {
    return this.stack.indexOf(cb) > -1;
  },
};

function fireCallback(cb) {
  if (!cb || Callbacks.has(cb)) return

  Callbacks.add(cb);
  cb();
}

export function call(path, callId) {
  const items = path.split('.');

  Callbacks.init(callId);

  for (let i = 1; i <= items.length; i++) {
    const key = items.slice(0, i).join('.');
    const listeners = LISTENERS[key];

    if (listeners) listeners.forEach(fireCallback);
  }
}
