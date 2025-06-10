[![npm](https://img.shields.io/npm/dm/justorm?style=flat-square)](https://www.npmjs.com/package/justorm)

# Just Store Manager

Simple state/store manager based on [Proxy](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

## API

- `createStore(name, object)` – creates new store with provided name

- `useStore(config: string | object | array )` – subscribe component to store

  - `useStore({ user: ['firstName'] })` – to field `firstName` of store `user`

  - `useStore({ user: true })` – to all fields of store `user`

  - `useStore('user')` – to all fields of stores `user`

  - `useStore(['user', 'auth'])` - to all fields of stores `user` and `auth`

  - `useStore(['user', { auth: ['isAuthorized'] }])`
    - to all fields of stores `user`
    - and field `isAuthorized` of store `auth`

- `connect(storeName: string, fields: string[], callback: () => void)` – subscribe callback to store.

- `disconnect(storeName: string, fields: string[], callback: () => void)` – unsubscribe callback to store.

* `store.originalObject` – returns original object (without Proxy wrapper)

## Import

```js
import { createStore, connect, disconnect } from 'justorm'; // for VanillaJS
// or
import { createStore, useStore } from 'justorm/react'; // for React
// or
import { createStore, useStore } from 'justorm/preact'; // for Preact
```

> NOTE: You don't need to unsubscribe from store when using decorator `useStore`. `useStore` do it for you.

## Create store

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

## Create class-based store

You can also create a store using a class definition with the `createClassStore` function. This approach provides better TypeScript support and allows for more complex store structures.

```js
import { createClassStore } from 'justorm';

class UserStore {
  isLogged: boolean = false;

  login() {
    this.isLogged = true;
  }

  logout() {
    this.isLogged = false;
  }
}

const userStore = createClassStore('user', UserStore);

function App() {
  const { isLogged, login, logout } = userStore({ user: ['isLogged'] });

  const onClick = isLogged ? logout : login;
  const text = isLogged ? 'logout' : 'login';

  return <button onClick={onClick}>{text}</button>;
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
