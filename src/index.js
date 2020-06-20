import connector from './connector';

export { createStore } from './create';

export function connect(config, cb) {
  const { connect, disconnect } = connector(config, cb);

  connect();
  return disconnect;
}
