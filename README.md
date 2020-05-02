[![npm](https://img.shields.io/npm/dm/justorm?style=flat-square)](https://www.npmjs.com/package/justorm)

Just Store Manager
====
Simple store manager based on [Proxy](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

🌈 Welcome to write plugins for your favourite frameworks (see [preact plugin](src/preact/index.js)).

## Create local store ([demo](https://codesandbox.io/s/justorm-local-store-4tsn7)).

_Better state._

```js
import { createStore } from 'justorm/preact';

class App extends Component {
  constructor(props) {
    super(props);
    this.store = createStore(this, { count: 0 });
  }

  onClick = () => {
    this.store.count++;
  }

  render() {
    const { count } = this.store;

    return [
      'Hi there!',
      count,
      <button onClick={this.onClick}>click me</button>
    ];
  }
}

```

## Create shared store ([demo](https://codesandbox.io/s/justorm-shared-store-yb5jg)).

Describe store and actions in one place.

```js
import { createStore } from 'justorm/preact';

createStore('user', {
  isLogged: false,
  login() {
    this.isLogged = true;
  },
  logout() {
    this.isLogged = false;
  }
});
```

## Subscribe to store

Specify store fields, that you want get updates from.

```js
import { withStore } from 'justorm/preact';

withStore({ user: ['isLogged'] })(
  function App({ store }) {
    const { isLogged, login, logout } = store.user;

    const onClick = isLogged ? logout : login;
    const text = isLogged ? 'logout' : 'login'

    return <button onClick={onClick}>{text}</button>;
  }
);
```

Use `withStore` as decorator for class components.

```js
import { withStore } from 'justorm/preact';

@withStore({ user: ['isLogged'] })
class App extends Component {
  render({ store }) {
    const { isLogged, login, logout } = store.user;
    const onClick = isLogged ? logout : login;
    const text = isLogged ? 'logout' : 'login';

    return <button onClick={onClick}>{text}</button>;
  }
});
````
