/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
declare global {
  interface Window {
    __SINGLETON_STORE_COUNT__: number | undefined;
  }
  namespace NodeJS {
    interface Global {
      __SINGLETON_STORE_COUNT__: number | undefined;
    }
  }
}

interface GlobalStore {
  __SINGLETON_STORE_COUNT__: number | undefined;
}

export default function getGlobal() {
  if (typeof self !== 'undefined') {
    return self as GlobalStore;
  }
  if (typeof window !== 'undefined') {
    return window as GlobalStore;
  }
  if (typeof global !== 'undefined') {
    return global as unknown as GlobalStore;
  }
  throw new Error('Unable to locate global object');
}
