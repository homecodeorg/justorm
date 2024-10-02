import { Store } from './create';

/**
 * Creates a store from a class definition.
 *
 * @param name - The name of the store.
 * @param StoreClass - The class definition for the store.
 * @returns A new store instance.
 */
export function createClassStore<T extends new () => Store>(name: string, StoreClass: T): InstanceType<T> {
  const store = new StoreClass() as InstanceType<T>;

  // Add the name property to the store
  (store as any).name = name;

  // Wrap methods to ensure proper `this` binding and any additional functionality
  Object.getOwnPropertyNames(StoreClass.prototype).forEach((key) => {
    if (typeof store[key as keyof typeof store] === 'function' && key !== 'constructor') {
      const originalMethod = store[key as keyof typeof store] as Function;
      (store as any)[key] = function (this: InstanceType<T>, ...args: any[]) {
        // Here you can add any additional logic before or after method calls
        return originalMethod.apply(this, args);
      };
    }
  });

  return store;
}
