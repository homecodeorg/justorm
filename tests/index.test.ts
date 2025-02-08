import { describe, expect, it, jest } from '@jest/globals';

import { createStore, connect } from '../src';

describe('justorm', () => {
  describe('createStore', () => {
    it('initializes a store with a number field correctly', () => {
      const store = createStore('store', { a: 1 });
      expect(store.a).toEqual(1);
    });

    it('initializes a store with a string field correctly', () => {
      const store = createStore('store', { a: 'test' });
      expect(store.a).toEqual('test');
    });

    it('initializes a store with an array field correctly', () => {
      const store = createStore('store', { a: [1, 2, 3] });
      expect(store.a).toEqual([1, 2, 3]);
      store.a.push(4);
      expect(store.a).toEqual([1, 2, 3, 4]);
    });

    it('initializes a store with an object field correctly', () => {
      const store = createStore('store', { a: { b: 1 } });
      expect(store.a).toEqual({ b: 1 });
    });

    it('initializes a store with a Map field correctly', () => {
      const map = new Map();
      const store = createStore('store', { a: map });

      // @ts-ignore
      expect(store.a.originalObject).toEqual(map);
    });

    it('initializes a store with a Set field correctly', () => {
      const set = new Set();
      const store = createStore('store', { a: set });
      // @ts-ignore
      expect(store.a.originalObject).toEqual(set);
    });
  });

  describe('connect', () => {
    it('calls the callback when a number field changes', done => {
      const store = createStore('store', { a: 1 });
      connect({ store: ['a'] }, () => done());
      store.a = 2;
    });

    it('calls the callback when a string field changes', done => {
      const store = createStore('store', { a: 'test' });
      connect({ store: ['a'] }, () => done());
      store.a = 'changed';
    });

    // ... Add more tests for array, object, function, Map, and Set fields
  });

  describe('disconnect', () => {
    it('prevents the callback from being called when a field changes', done => {
      const store = createStore('store', { a: 1 });
      const callback = jest.fn();
      const disconnect = connect({ store: ['a'] }, callback);

      disconnect();
      store.a = 2;

      setTimeout(() => {
        expect(callback).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });
});
