import { h, Component } from 'preact';

import connector from '../tools/connector';

export { createStore, connect, disconnect } from '../store';

export function withStore(config = {}) {
  return function (WrappedComponent) {
    return class extends Component {
      constructor(props) {
        super(props);

        this.state = { updated: null };
        this.update = () => this.setState({ updated: Date.now() });
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
