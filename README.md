[![npm](https://img.shields.io/npm/dm/justorm?style=flat-square)](https://www.npmjs.com/package/justorm)

# Just Store Manager

Simple state/store manager based on [Proxy](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

## API

- `createStore(name, object)` – creates new store with provided name

  > NOTE: Using with React or Preact you can pass `this` instead of name to create local component store.
  >
  > See [Create local store](#create-local-store).

- `withStore(config: string | object | array )` – subscribe component to store

  - `withStore({ user: ['firstName'] })` – to field `firstName` of store `user`

  - `withStore({ user: true })` – to all fields of store `user`

  - `withStore('user')` – to all fields of stores `user`

  - `withStore(['user', 'auth'])` - to all fields of stores `user` and `auth`

  - `withStore(['user', { auth: ['isAuthorized'] }])`
    - to all fields of stores `user`
    - and field `isAuthorized` of store `auth`

- `connect(storeName: string, fields: string[], callback: () => void)` – subscribe callback to store.

- `disconnect(storeName: string, fields: string[], callback: () => void)` – unsubscribe callback to store.

* `store.originalObject` – returns original object (without Proxy wrapper)

## Import

```js
import { createStore, connect, disconnect } from 'justorm'; // for VanillaJS
// or
import { createStore, createLocalStore, withStore } from 'justorm/react'; // for React
// or
import { createStore, createLocalStore, withStore } from 'justorm/preact'; // for Preact
```

> NOTE: You don't need to unsubscribe from store when usign decorator `withStore`. `withStore` do it for you.

## Create local store

[Demo](https://codesandbox.io/s/justorm-local-store-4tsn7).

```js
class App extends Component {
  constructor(props) {
    super(props);
    this.store = createLocalStore(this, { count: 0 });
  }

  onClick = () => {
    this.store.count++;
  };

  render() {
    const { count } = this.store;

    return [
      'Hi there!',
      count,
      <button onClick={this.onClick}>click me</button>,
    ];
  }
}
```

## Create shared store

Describe store and actions in one place. [Demo](https://codesandbox.io/s/justorm-shared-store-yb5jg).

```js
createStore('user', {
  isLogged: false,
  login() {
    this.isLogged = true;
  },
  logout() {
    this.isLogged = false;
  },
});
```

## Subscribe to store

Specify store fields, that you want get updates from.

```js
withStore({ user: ['isLogged'] })(function App({ store }) {
  const { isLogged, login, logout } = store.user;

  const onClick = isLogged ? logout : login;
  const text = isLogged ? 'logout' : 'login';

  return <button onClick={onClick}>{text}</button>;
});
```

Use `withStore` as decorator for class components.

```js
@withStore({ user: ['isLogged'] })
class App extends Component {
  render({ store }) {
    const { isLogged, login, logout } = store.user;
    const onClick = isLogged ? logout : login;
    const text = isLogged ? 'logout' : 'login';

    return <button onClick={onClick}>{text}</button>;
  }
});
```

## Vanilla JS

[Demo](https://codesandbox.io/s/justorm-vanila-js-sb6dp).

```js
import { createStore, connect, disconnect } from 'justorm';

const myStore = createStore('my-store', {
  isLogged: false;
  user: null
});

function onLoggedChange() {
  console.log(myStore.isLogged ? 'Welcome!' : 'See ya!');
}
function onAnyFieldChange() {
  console.log('Some field changed:', myStore);
}

connect('my-store', ['isLogged'], onLoggedChange);
connect('my-store', onAnyFieldChange);

myStore.isLogged = true;
// Welcome!
// Some field changed: { isloggeg: true, user: null }
console.log('-----------');

myStore.user = 'Jess';
// Some field changed: { isloggeg: true, user: 'Jess' }
console.log('-----------');

Object.assign(myStore, { isLogged: false, user: null });
// See ya!
// Some field changed: { isLogged: false, user: null }
// Some field changed: { isLogged: false, user: null }

disconnect('my-store', onLoggedChange);
disconnect('my-store', onAnyFieldChange);
```
