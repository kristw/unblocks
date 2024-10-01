import { ModeManager } from '../src';

describe('index', () => {
  it('exports modules', () => {
    [ModeManager].forEach((x) => expect(x).toBeDefined());
  });
});
