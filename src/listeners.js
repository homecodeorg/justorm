import { get, set } from './tools';

const LISTENERS = {};

export function subscribe(path, cb) {
  const currListeners = get(LISTENERS, path);

  if (!currListeners) {
    set(LISTENERS, path, [cb]);
    return;
  }

  if (currListeners.indexOf(cb) === -1) currListeners.push(cb);
}

export function unsubscribe(path, cb) {
  const currListeners = get(LISTENERS, path);

  if (!currListeners) return;

  const index = currListeners.indexOf(cb);

  if (index === -1) return;

  set(
    LISTENERS,
    path,
    currListeners.slice(0, index).concat(currListeners.slice(index + 1))
  );
}

export function call(path) {
  for (let i = 1; i <= path.length; i++) {
    const listeners = get(LISTENERS, path.slice(0, i));

    if (Array.isArray(listeners)) {
      listeners.forEach(function (cb) { cb() });
      return;
    }
  }
}
