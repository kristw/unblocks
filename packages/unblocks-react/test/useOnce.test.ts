import { renderHook } from '@testing-library/react';

import useOnce from '../src/hooks/useOnce';

describe('useOnce', () => {
  it('should run effect only once on mount', () => {
    const effectMock = jest.fn();

    renderHook(() => useOnce(effectMock));

    expect(effectMock).toHaveBeenCalledTimes(1);
  });

  it('should not run effect again on rerender', () => {
    const effectMock = jest.fn();

    const { rerender } = renderHook(() => useOnce(effectMock));

    expect(effectMock).toHaveBeenCalledTimes(1);

    rerender();
    expect(effectMock).toHaveBeenCalledTimes(1);

    rerender();
    expect(effectMock).toHaveBeenCalledTimes(1);
  });

  it('should call cleanup function on unmount', () => {
    const cleanupMock = jest.fn();
    const effectMock = jest.fn(() => cleanupMock);

    const { unmount } = renderHook(() => useOnce(effectMock));

    expect(effectMock).toHaveBeenCalledTimes(1);
    expect(cleanupMock).not.toHaveBeenCalled();

    unmount();

    expect(cleanupMock).toHaveBeenCalledTimes(1);
  });

  it('should work with effects that return void', () => {
    const effectMock = jest.fn(() => {
      // Side effect without cleanup
    });

    const { unmount } = renderHook(() => useOnce(effectMock));

    expect(effectMock).toHaveBeenCalledTimes(1);

    unmount();
    // No cleanup to call, should not throw
  });

  it('should handle effects with side effects', () => {
    const sideEffectLog: string[] = [];
    const effectMock = jest.fn(() => {
      sideEffectLog.push('effect-executed');
      return () => {
        sideEffectLog.push('cleanup-executed');
      };
    });

    const { unmount } = renderHook(() => useOnce(effectMock));

    expect(sideEffectLog).toEqual(['effect-executed']);

    unmount();

    expect(sideEffectLog).toEqual(['effect-executed', 'cleanup-executed']);
  });

  it('should support multiple instances with independent effects', () => {
    const effect1Mock = jest.fn();
    const effect2Mock = jest.fn();

    renderHook(() => useOnce(effect1Mock));
    renderHook(() => useOnce(effect2Mock));

    expect(effect1Mock).toHaveBeenCalledTimes(1);
    expect(effect2Mock).toHaveBeenCalledTimes(1);
  });
});
