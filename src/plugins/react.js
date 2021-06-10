import React, { Component } from 'react';

import connector from '../connector';
import { createConnectedStore } from '../create';

import { createStore as _createStore } from '../';

function createUpdater(instance) {
  return () => instance.setState({ _justorm: Date.now() });
}

export function createStore(instance, obj) {
  if (typeof instance === 'string') return _createStore(instance, obj);
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

      render() {
        const { store } = this.justormAPI;
        return React.createElement(
          WrappedComponent,
          Object.assign({ store }, this.props)
        );
      }
    };
  };
}
