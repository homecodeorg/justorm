import { STORE, connect, disconnect } from '../store';

export default function connector(config, updater) {
  const entries = Object.entries(config);
  const store = entries.reduce(function (acc, s) {
    const name = s[0];
    return Object.assign(acc, { [name]: STORE[name] });
  }, {});

  return {
    store,
    connect: function () {
      entries.forEach(e => {
        const name = e[0];
        const fields = e[1];
        connect(name, fields, updater);
      });
    },
    disconnect: function () {
      entries.forEach(e => {
        const name = e[0];
        const fields = e[1];
        disconnect(name, fields, updater);
      });
    },
  };
}
