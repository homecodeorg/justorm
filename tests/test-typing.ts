// Test file to verify typing improvements
import { createStore } from '../src/index';
import { useStore } from '../src/plugins/react';

const userStore = createStore('user', {
  a: 'asd',
  b: 44,
  setA(newA: string) {
    this.a = newA; // 'this' should be typed as the store shape
  },
});

const stores = useStore<{ user: typeof userStore }>({ user: ['a'] });

stores.user.setA('new value');
