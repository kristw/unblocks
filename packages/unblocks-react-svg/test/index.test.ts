import { SubtleOffset, useSvgId } from '../src';

describe('@unblocks/react-svg', () => {
  it('should export useSvgId', () => {
    expect(useSvgId).toBeDefined();
  });

  it('should export SubtleOffset', () => {
    expect(SubtleOffset).toBeDefined();
  });
});
