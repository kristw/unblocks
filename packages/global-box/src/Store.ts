/**
 * simple key-value store for global cache
 */
export default class Store {
  readonly items: {
    [globalId: string]: unknown;
  };

  constructor() {
    this.items = {};
  }

  /**
   * Check if the item with given globalId exists
   * @param globalId
   */
  has(globalId: string) {
    const item = this.items[globalId];

    return item != null;
  }

  /**
   * Get value from globalId and cast to type T
   * @param globalId
   */
  get<T>(globalId: string) {
    const value = this.items[globalId] as T | undefined;

    return value;
  }

  /**
   * Get value from globalId if the value exists.
   * Otherwise, create a new value.
   * @param globalId
   * @param factory
   */
  getOrCreate<T>(globalId: string, factory: () => T) {
    if (this.has(globalId)) {
      return this.get<T>(globalId) as T;
    }
    const value = factory();
    this.set(globalId, value);

    return value;
  }

  /**
   * Store the given globalId and value
   * @param globalId
   * @param value
   */
  set<T>(globalId: string, value: T) {
    if (this.has(globalId)) {
      // eslint-disable-next-line no-console
      console.warn(`Item with globalId "${globalId}" already exists. You are assigning a new value.`);
    }
    this.items[globalId] = value;

    return this;
  }

  /**
   * Remove item with the specified globalId from this store.
   * If the item with globalId does not exist, do nothing.
   * @param globalId
   */
  remove(globalId: string) {
    delete this.items[globalId];

    return this;
  }
}
