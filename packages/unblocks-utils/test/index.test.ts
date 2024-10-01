import { ModeManager, Sizer } from '../src';

describe('index', () => {
  it('exports modules', () => {
    [ModeManager, Sizer].forEach((x) => expect(x).toBeDefined());
  });
});
