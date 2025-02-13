import React, {
  useState,
  useEffect,
  useMemo,
  Component,
  FunctionComponent,
} from 'react';

import connector, { Config } from '../connector';
import { createConnectedStore } from '../create';
import { createStore as _createStore } from '../';

function createUpdater(instance: Component<any, any>) {
  return () => instance.setState({ _justorm: Date.now() });
}

export function createStore(instance: Component<any, any>, obj: any) {
  if (typeof instance === 'string') return _createStore(instance, obj);
  return createConnectedStore(obj, createUpdater(instance));
}

/**
 * Connects a React component to a store or a set of stores.
 * @param config
 * @returns
 */
export function withStore(config: Config = {}) {
  return function (WrappedComponent: FunctionComponent) {
    return function WithStoreComponent(props: any) {
      const [updated, setUpdated] = useState(Date.now());
      const justormAPI = connector(config, () => setUpdated(Date.now()));
      const store = justormAPI.store.originalObject;

      useEffect(() => {
        justormAPI.connect();
        return () => {
          justormAPI.disconnect();
        };
      }, []);

      return React.createElement(
        WrappedComponent,
        Object.assign({ store, key: updated }, props)
      );
    };
  };
}

/**
 * Subscribes to a store or a set of stores and returns the store object.
 * @param config
 * @returns
 */
export function useStore(config: Config = {}) {
  const [_, setUpdated] = useState(Date.now());
  const api = useMemo(
    () => connector(config, () => setUpdated(Date.now())),
    []
  );

  useEffect(() => {
    api.connect();
    return () => api.disconnect();
  }, []);

  return api.store;
}
