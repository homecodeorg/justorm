const LISTENERS: Record<string, Function[]> = {};

/**
 * Subscribes a callback function to a path.
 *
 * @param path - The path.
 * @param cb - The callback function to subscribe.
 */
export function subscribe(path: string, cb: Function): void {
  // console.log('Subscribing to path:', path);
  const currListeners = LISTENERS[path];

  if (!currListeners) {
    LISTENERS[path] = [cb];
    // console.log('New listener added:', LISTENERS[path]);
    return;
  }

  if (currListeners.indexOf(cb) === -1) {
    currListeners.push(cb);
    // console.log('Listener added to existing path:', LISTENERS[path]);
  }
}

/**
 * Unsubscribes a callback function from a path.
 *
 * @param path - The path.
 * @param cb - The callback function to unsubscribe.
 */
export function unsubscribe(path: string, cb: Function): void {
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
  stack: [] as Function[],
  id: null as null | string,
  init(id: string) {
    if (id === this.id) return;
    this.id = id;
    this.stack = [];
  },
  add(cb: Function) {
    if (this.has(cb)) return;
    this.stack.push(cb);
  },
  has(cb: Function) {
    return this.stack.indexOf(cb) > -1;
  },
};

/**
 * Fires a callback function if it's not in the Callbacks stack.
 *
 * @param cb - The callback function to fire.
 */
function fireCallback(cb: Function) {
  if (!cb || Callbacks.has(cb)) return;

  Callbacks.add(cb);
  cb();
}

export function call(path: string, callId: string) {
  // console.log('Calling listeners for path:', path);
  const items = path.split('.');

  Callbacks.init(callId);

  for (let i = 1; i <= items.length; i++) {
    const key = items.slice(0, i).join('.');
    // console.log('LISTENERS', LISTENERS);

    const listeners = LISTENERS[key];
    // console.log('Listeners for key:', key, listeners);

    if (listeners) listeners.forEach(fireCallback);
  }
  // console.log('Call complete for path:', path);
}
