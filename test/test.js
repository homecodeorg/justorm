const store = justorm.createStore('store', {
  a: 1,
  b: [1, 2, 3],
  c: {
    a: [1, 2, 3],
    b: 1,
  },
});
const store2 = justorm.createStore('store2', {
  a: 1,
  b: [1, 2, 3],
  c: {
    a: [1, 2, 3],
    b: 1,
  },
});

// justorm.connect('test', ['a'], () => console.log('store.a'));
// justorm.connect('test', ['b'], () => console.log('store.b'));
// justorm.connect('test', ['b.0'], () => console.log('store.b.0'));
// justorm.connect('test', ['c'], () => console.log('store.c'));
// justorm.connect('store', ['c.a'], () => console.log('store.c.a'));
// justorm.connect('store', ['c.a.0'], () => console.log('store.c.a.0'));
// justorm.connect('store', ['c.a', 'c.a.0'], () => console.log('store.c.a*'));
// justorm.connect('store2', ['c.a'], () => console.log('store2.c.a'));
const disconnect = justorm.connect(
  {
    store: ['c.a.0', 'c.a.1'],
    store2: ['c.a'],
  },
  () => console.log('store*')
);

// justorm.connect('store2', ['c.a.0'], () => console.log('store2.c.a.0'));
// justorm.connect('test', ['c.b'], () => console.log('store.c.b'));

function test1(argument) {
  console.log('test: c.a.0');
  store.c.a[0] = 'bbb';
}

// store.a = 2;
// store.b[0] = 'aaa';
// test1();
// console.log('test2: c.a.0');
store.c.a[0] = 'aaa';
store.c.a[1] = 'bbb';
store2.c.a[0] = 'bbb';
// store.c.b = 1;

// disconnect();
// store.c.a[0] = 'zzz';
// store2.c.a[0] = 'zzz';
