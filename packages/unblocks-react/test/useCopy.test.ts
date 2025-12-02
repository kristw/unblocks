import { act, renderHook } from '@testing-library/react';

import useCopy from '../src/hooks/useCopy';

describe('useCopy', () => {
  let mockWriteText: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockWriteText = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    consoleErrorSpy.mockRestore();
  });

  it('should initialize with copied as false', () => {
    const { result } = renderHook(() => useCopy('test text'));

    expect(result.current.copied).toBe(false);
  });

  it('should copy text to clipboard when handleCopy is called', async () => {
    mockWriteText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy('test text'));

    await act(async () => {
      await result.current.handleCopy();
    });

    expect(mockWriteText).toHaveBeenCalledWith('test text');
    expect(result.current.copied).toBe(true);
  });

  it('should reset copied to false after default delay (3000ms)', async () => {
    mockWriteText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy('test text'));

    await act(async () => {
      await result.current.handleCopy();
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.copied).toBe(false);
  });

  it('should reset copied to false after custom delay', async () => {
    mockWriteText.mockResolvedValue(undefined);
    const customDelay = 5000;
    const { result } = renderHook(() => useCopy('test text', customDelay));

    await act(async () => {
      await result.current.handleCopy();
    });

    expect(result.current.copied).toBe(true);

    // Should still be true before custom delay
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.copied).toBe(true);

    // Should be false after custom delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.copied).toBe(false);
  });

  it('should handle clipboard API errors gracefully', async () => {
    const error = new Error('Clipboard API failed');
    mockWriteText.mockRejectedValue(error);

    const { result } = renderHook(() => useCopy('test text'));

    await act(async () => {
      await result.current.handleCopy();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy code:', error);
    expect(result.current.copied).toBe(false);
  });

  it('should update copied text when value changes', async () => {
    mockWriteText.mockResolvedValue(undefined);
    const { result, rerender } = renderHook(({ value }: { value: string }) => useCopy(value), {
      initialProps: { value: 'initial text' },
    });

    await act(async () => {
      await result.current.handleCopy();
    });

    expect(mockWriteText).toHaveBeenCalledWith('initial text');

    mockWriteText.mockClear();
    rerender({ value: 'updated text' });

    await act(async () => {
      await result.current.handleCopy();
    });

    expect(mockWriteText).toHaveBeenCalledWith('updated text');
  });

  it('should handle multiple copy calls', async () => {
    mockWriteText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy('test text'));

    // First copy
    await act(async () => {
      await result.current.handleCopy();
    });

    expect(result.current.copied).toBe(true);
    expect(mockWriteText).toHaveBeenCalledTimes(1);

    // Second copy before timeout
    await act(async () => {
      await result.current.handleCopy();
    });

    expect(result.current.copied).toBe(true);
    expect(mockWriteText).toHaveBeenCalledTimes(2);

    // Wait for timeout
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.copied).toBe(false);
  });

  it('should copy empty string', async () => {
    mockWriteText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy(''));

    await act(async () => {
      await result.current.handleCopy();
    });

    expect(mockWriteText).toHaveBeenCalledWith('');
    expect(result.current.copied).toBe(true);
  });

  it('should copy text with special characters', async () => {
    mockWriteText.mockResolvedValue(undefined);
    const specialText = 'Text with\nnewlines\tand\ttabs and "quotes"';
    const { result } = renderHook(() => useCopy(specialText));

    await act(async () => {
      await result.current.handleCopy();
    });

    expect(mockWriteText).toHaveBeenCalledWith(specialText);
    expect(result.current.copied).toBe(true);
  });

  it('should handle delay of 0', async () => {
    mockWriteText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy('test text', 0));

    await act(async () => {
      await result.current.handleCopy();
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current.copied).toBe(false);
  });

  it('should maintain separate timers for multiple instances', async () => {
    mockWriteText.mockResolvedValue(undefined);
    const { result: result1 } = renderHook(() => useCopy('text1', 1000));
    const { result: result2 } = renderHook(() => useCopy('text2', 2000));

    await act(async () => {
      await result1.current.handleCopy();
      await result2.current.handleCopy();
    });

    expect(result1.current.copied).toBe(true);
    expect(result2.current.copied).toBe(true);

    // First instance should reset after 1000ms
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result1.current.copied).toBe(false);
    expect(result2.current.copied).toBe(true);

    // Second instance should reset after another 1000ms
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result1.current.copied).toBe(false);
    expect(result2.current.copied).toBe(false);
  });
});
