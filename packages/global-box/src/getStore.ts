import getGlobal from './getGlobal';
import Store from './Store';

const globals = getGlobal();

export const COUNTER = '__SINGLETON_STORE_COUNT__';

let store: Store | undefined;

/**
 * Retrieve the singleton store
 */
export default function getStore() {
  if (typeof store === 'undefined') {
    const oldCount = globals[COUNTER];
    if (typeof oldCount === 'number') {
      console.warn(
        `Found ${oldCount} existing instance(s) of global-box. This may cause unexpected behaviors. There should be only one global-box in your node_modules. Check your dependencies. All libraries should list global-box as peerDependencies and only install it as dependencies at the application level.`
      );
      globals[COUNTER] = oldCount + 1;
    } else {
      globals[COUNTER] = 1;
    }

    store = new Store();
  }
  return store;
}

/**
 * Only expose for testing
 * Do not use if you don't know what you are doing.
 */
export function dangerouslyResetStore() {
  store = undefined;
}
