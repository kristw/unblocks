import Sizer from '../src/utils/Sizer';

export const DEFAULT_SIZE_INDEX = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

describe('Sizer', () => {
  const sizer = new Sizer(DEFAULT_SIZE_INDEX);

  describe('down', () => {
    it('should decrease the size by the specified amount', () => {
      expect(sizer.down('md', 1)).toBe('sm');
      expect(sizer.down('lg', 2)).toBe('sm');
    });

    it('should not decrease the size below the minimum size', () => {
      expect(sizer.down('xs', 1)).toBe('xs');
      expect(sizer.down('sm', 5)).toBe('xs');
    });
  });

  describe('up', () => {
    it('should increase the size by the specified amount', () => {
      expect(sizer.up('sm', 1)).toBe('md');
      expect(sizer.up('md', 2)).toBe('xl');
    });

    it('should not increase the size beyond the maximum size', () => {
      expect(sizer.up('xl', 1)).toBe('xl');
      expect(sizer.up('lg', 5)).toBe('xl');
    });
  });
});
