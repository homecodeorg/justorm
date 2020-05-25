import { h, Component } from 'preact';

import { STORE, connect, disconnect } from '../store';

export { createStore, connect, disconnect } from '../store';

export function withStore(config = {}) {
  var entries = Object.entries(config);
  var store = entries.reduce(function (acc, s) {
    var name = s[0];
    return Object.assign(acc, { [name]: STORE[name] });
  }, {});

  return function (WrappedComponent) {
    return class extends Component {
      constructor(props) {
        super(props);

        this.state = { updated: null };

        this.update = () => {
          this.setState({ updated: Date.now() });
        };

        entries.forEach(
          function (e) {
            var name = e[0];
            var fields = e[1];
            connect(name, fields, this.update);
          }.bind(this)
        );
      }

      componentWillUnmount() {
        entries.forEach(
          function (e) {
            var name = e[0];
            var fields = e[1];
            disconnect(name, fields, this.update);
          }.bind(this)
        );
      }

      toString() {
        return `withStore(${WrappedComponent.name})`;
      }

      render(props, state) {
        return h(WrappedComponent, Object.assign(props, { store }));
      }
    };
  };
}
