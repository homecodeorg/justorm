import * as React from 'react';
const { useState, useEffect, useMemo } = React;

import connector, { Config, InferStoreFromConfig } from '../connector';
import { createConnectedStore } from '../create';
import { createStore as _createStore } from '../';

function createUpdater(instance: React.Component<any, any>) {
  return () => instance.setState({ _justorm: Date.now() });
}

export function createStore(instance: React.Component<any, any>, obj: any) {
  if (typeof instance === 'string') return _createStore(instance, obj);
  return createConnectedStore(obj, createUpdater(instance));
}

/**
 * Subscribes to a store or a set of stores and returns the store object.
 * For better typing, use the overload with explicit type parameter:
 * useStore<{user: UserStoreType}>({user: ['a']})
 */
export function useStore<
  T extends Record<string, any> = InferStoreFromConfig<Config>
>(config: Config): T {
  const [_, setUpdated] = useState(Date.now());
  const api = useMemo(
    () => connector(config, () => setUpdated(Date.now())),
    []
  );

  useEffect(() => {
    api.connect();
    return () => api.disconnect();
  }, []);

  return api.store as T;
}
