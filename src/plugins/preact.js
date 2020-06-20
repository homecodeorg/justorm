import { h, Component } from 'preact';

import connector from '../connector';
import { createConnectedStore } from '../create';

export { createStore } from '../';

function createUpdater(instance) {
  return () => instance.setState({ _justorm: Date.now() });
}

export function createLocalStore(instance, obj) {
  return createConnectedStore(obj, createUpdater(instance));
}

export function withStore(config = {}) {
  return function (WrappedComponent) {
    return class extends Component {
      constructor(props) {
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

      render(props) {
        const { store } = this.justormAPI;
        return h(WrappedComponent, Object.assign(props, { store }));
      }
    };
  };
}
