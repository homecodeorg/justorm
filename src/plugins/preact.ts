import { h, Component } from 'preact';

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
    return class extends Component {
      update: any;
      justormAPI: any;

      constructor(props: any) {
        super(props);

        this.state = { updated: null };
        this.update = createUpdater(this);
        this.justormAPI = connector(config, this.update);

        this.justormAPI.connect();
      }

      componentWillUnmount() {
        this.justormAPI.disconnect();
      }

      toString() {
        return `withStore(${WrappedComponent.name})`;
      }

      render(props: any) {
        const { store } = this.justormAPI;
        return h(WrappedComponent, Object.assign(props, { store }));
      }
    };
  };
}
