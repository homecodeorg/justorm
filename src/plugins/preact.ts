import { h } from 'preact';
import { useState, useEffect, useCallback, useMemo } from 'preact/hooks';

import connector from '../connector';
import { createConnectedStore } from '../create';

import { createStore as _createStore } from '../';

function createUpdater(instance: any) {
  return () => instance.setState({ _justorm: Date.now() });
}

export function createStore(instance: any, obj: any) {
  if (typeof instance === 'string') return _createStore(instance, obj);
  return createConnectedStore(obj, createUpdater(instance));
}

export function withStore(config: any = {}) {
  return function (WrappedComponent: any) {
    return function WithStoreComponent(props: any) {
      const [, setUpdated] = useState(null);
      const update = useCallback((val: any) => setUpdated(val), []);
      const justormAPI = useMemo(() => connector(config, update), []);

      useEffect(() => {
        justormAPI.connect();
        return () => justormAPI.disconnect();
      }, [justormAPI]);

      const { store } = justormAPI;
      return h(WrappedComponent, Object.assign(props, { store }));
    };
  };
}
