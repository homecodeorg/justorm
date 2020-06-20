import { STORE, connect, disconnect } from '../store';

function getEntries(config) {
  if (typeof config === 'string') return [[config]];
  if (Array.isArray(config)) {
    return config.reduce((acc, item) => {
      if (typeof item === 'string') acc.push([item]);
      if (typeof item === 'object') acc.push(...Object.entries(item));
      return acc;
    }, []);
  }

  return Object.entries(config);
}

export default function connector(config, updater) {
  const entries = getEntries(config);
  const store = entries.reduce(function (acc, s) {
    const name = s[0];
    return Object.assign(acc, { [name]: STORE[name] });
  }, {});

  return {
    store,
    connect: function () {
      entries.forEach(([name, fields]) => connect(name, fields, updater));
    },
    disconnect: function () {
      entries.forEach(([name, fields]) => disconnect(name, fields, updater));
    },
  };
}
