import mockConsole, { RestoreConsole } from 'jest-mock-console';
import { getStore, globalBox } from '../src';
import Store from '../src/Store';
import { COUNTER, dangerouslyResetStore } from '../src/getStore';
import getGlobal from '../src/getGlobal';

describe('global-box', () => {
  let restoreConsole: RestoreConsole;

  beforeEach(() => {
    restoreConsole = mockConsole();
  });

  afterEach(() => {
    restoreConsole();
  });

  describe('globalBox()', () => {
    it('is defined', () => {
      expect(globalBox).toBeDefined();
    });
  });

  describe('getStore()', () => {
    it('is defined', () => {
      expect(getStore).toBeDefined();
    });
    it('returns a store', () => {
      dangerouslyResetStore();
      expect(getStore()).toBeInstanceOf(Store);
      expect(getGlobal()[COUNTER]).toEqual(1);
    });
    it('always return the same store', () => {
      const store1 = getStore();
      const store2 = getStore();
      expect(store1).toBe(store2);
    });
    it('warns when there are existing store(s)', () => {
      dangerouslyResetStore();
      const globals = getGlobal();
      // manually set
      globals[COUNTER] = 1;
      expect(getStore()).toBeInstanceOf(Store);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(globals[COUNTER]).toEqual(2);
      expect(getStore()).toBeInstanceOf(Store);
      // check that it only warns on the first call to getStore
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(globals[COUNTER]).toEqual(2);
    });
  });
});
