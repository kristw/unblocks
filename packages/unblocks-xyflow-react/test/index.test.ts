import { DagreFlow, MultiHandle, WithMultiHandle } from '../src';

describe('index', () => {
  it('exports modules', () => {
    [DagreFlow, MultiHandle, WithMultiHandle].forEach((x) => expect(x).toBeDefined());
  });
});
