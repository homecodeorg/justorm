import connector, { Config } from './connector';

export { createStore } from './create';

/**
 * Creates a connection to a store or stores specified in the configuration
 *  and returns a disconnect function.
 *
 * @param config - The configuration object.
 * @param cb - The callback function.
 * @returns A disconnect function that can be used to unsubscribe the callback function from changes in the store(s).
 */
export function connect(config: Config, cb: Function): Function {
  const { connect, disconnect } = connector(config, cb);

  connect(); // immediately connect
  return disconnect;
}
