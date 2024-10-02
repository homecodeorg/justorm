import { createClassStore } from '../src/createClassStore';

describe('createClassStore', () => {
  it('creates a store from a class definition', () => {
    class MyStore {
      name: string;
      items: string[] = [];

      constructor() {
        this.name = '';
      }

      addItem(item: string) {
        this.items.push(item);
      }

      removeItem(item: string) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
          this.items.splice(index, 1);
        }
      }
    }

    const store = createClassStore('myStore', MyStore);

    expect(store).toBeInstanceOf(MyStore);
    expect(store.name).toBe('myStore');
    expect(store.items).toEqual([]);

    store.addItem('apple');
    expect(store.items).toEqual(['apple']);

    store.removeItem('apple');
    expect(store.items).toEqual([]);
  });

  it('properly types methods within the store', () => {
    class TypedStore {
      name: string;
      value: number = 0;

      constructor() {
        this.name = '';
      }

      increment() {
        this.value += 1;
      }

      decrement() {
        this.value -= 1;
      }

      setValue(newValue: number) {
        this.value = newValue;
      }
    }

    const store = createClassStore('typedStore', TypedStore);

    // TypeScript should recognize these method calls without type errors
    store.increment();
    store.decrement();
    store.setValue(10);

    expect(store.value).toBe(10);
  });

  it('maintains API similarity with createStore', () => {
    class SimpleStore {
      name: string;
      count: number = 0;

      constructor() {
        this.name = '';
      }

      increment() {
        this.count += 1;
      }
    }

    const store = createClassStore('simpleStore', SimpleStore);

    expect(store.name).toBe('simpleStore');
    expect(typeof store.increment).toBe('function');
    expect(store.count).toBe(0);

    store.increment();
    expect(store.count).toBe(1);
  });
});
