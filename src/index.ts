import connector, { Config } from './connector';

export { createStore, StoreShape, InferStoreType } from './create';
export { createClassStore } from './createClassStore';
export type { InferStoreFromConfig, Config } from './connector';

/**
 * Creates a connection to a store or stores specified in the configuration
 *  and returns a disconnect function.
 *
 * @param config - The configuration object.
 * @param cb - The callback function.
 * @returns A disconnect function that can be used to unsubscribe the callback function from changes in the store(s).
 */
export function connect(config: Config, cb: Function): Function {
  // console.log('Entering connect function:', config, cb);
  const { connect, disconnect } = connector(config, cb);

  connect(); // immediately connect
  return disconnect;
}
