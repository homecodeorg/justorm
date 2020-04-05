[![npm](https://img.shields.io/npm/dm/justorm?style=flat-square)](https://www.npmjs.com/package/justorm)

Just Store Manager
====
Simple store manager based on [Proxy](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy).


🌈 Welcome to write plugins for your favourite frameworks (see [preact plugin](src/preact/index.js)).

### 1. Create store

Describe store and actions in one place.

```js
// src/store/user.js
import { create } from 'justorm/preact';

export create('user', {
  isLogged: false,
  login() {
    this.isLogged = true;
  },
  logout() {
    this.isLogged = false;
  }
});
```

### 2. Subscribe to store

Spicify store fields, that you want get updates from.

```js
// src/components/App.jsx
import { h } from 'preact';
import { withStore } from 'justorm/preact';

export withStore({ user: ['isLogged'] })(function App({ store }) {
  const { isLogged, login, logout } = store.user;

  const onClick = isLogged ? logout : login;
  const text = isLogged ? 'logout' : 'login'

  return <button onClick={onClick}>{text}</button>;
});
```
