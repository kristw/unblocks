import ModeManager from '../src/utils/ModeManager';

describe('ModeManager', () => {
  // Define some sample modes to use in tests
  const modes: readonly string[] = ['mode1', 'mode2', 'mode3'];
  const manager = new ModeManager(modes);

  describe('constructor', () => {
    it('should initialize correctly', () => {
      // Check if modes are initialized correctly
      expect(manager.modes).toEqual(modes);
    });
  });
  describe('.getIndex(mode)', () => {
    it('should return index', () => {
      expect(manager.getIndex('mode1')).toBe(0);
    });
    it('should throw an error for invalid mode name', () => {
      const modeManager = new ModeManager(modes);

      // Invalid mode name
      expect(() => modeManager.getIndex('invalidMode')).toThrowError('Invalid mode name: invalidMode');
    });
  });
  describe('.getMode(index)', () => {
    it('should return mode', () => {
      expect(manager.getMode(1)).toBe('mode2');
    });
    it('should throw an error for invalid index', () => {
      const modeManager = new ModeManager(modes);

      // Invalid index
      expect(() => modeManager.getMode(5)).toThrowError('Invalid index: 5');
    });
  });
});
