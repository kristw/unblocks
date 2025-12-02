import { act, renderHook } from '@testing-library/react';

import useControllableState from '../src/hooks/useControllableState';

describe('useControllableState', () => {
  describe('uncontrolled mode', () => {
    it('should initialize with default value when value is undefined', () => {
      const { result } = renderHook(() =>
        useControllableState({
          value: undefined,
          defaultValue: 'initial',
        })
      );

      expect(result.current[0]).toBe('initial');
    });

    it('should update state when setState is called', () => {
      const { result } = renderHook(() =>
        useControllableState({
          value: undefined,
          defaultValue: 'initial',
        })
      );

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
    });

    it('should support function updater', () => {
      const { result } = renderHook(() =>
        useControllableState({
          value: undefined,
          defaultValue: 10,
        })
      );

      act(() => {
        result.current[1]((prev) => prev + 5);
      });

      expect(result.current[0]).toBe(15);
    });

    it('should call onChange when state changes', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useControllableState({
          value: undefined,
          defaultValue: 'initial',
          onChange,
        })
      );

      act(() => {
        result.current[1]('updated');
      });

      expect(onChange).toHaveBeenCalledWith('updated');
      expect(result.current[0]).toBe('updated');
    });

    it('should call onChange with function updater result', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useControllableState({
          value: undefined,
          defaultValue: 5,
          onChange,
        })
      );

      act(() => {
        result.current[1]((prev) => prev * 2);
      });

      expect(onChange).toHaveBeenCalledWith(10);
    });
  });

  describe('controlled mode', () => {
    it('should use controlled value when provided', () => {
      const { result } = renderHook(() =>
        useControllableState({
          value: 'controlled',
          defaultValue: 'default',
        })
      );

      expect(result.current[0]).toBe('controlled');
    });

    it('should not update internal state when setState is called', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useControllableState({
          value: 'controlled',
          defaultValue: 'default',
          onChange,
        })
      );

      act(() => {
        result.current[1]('new-value');
      });

      // State should remain as controlled value
      expect(result.current[0]).toBe('controlled');
      // onChange should still be called
      expect(onChange).toHaveBeenCalledWith('new-value');
    });

    it('should update when controlled value changes', () => {
      const { result, rerender } = renderHook(
        ({ value }: { value: string }) =>
          useControllableState({
            value,
            defaultValue: 'default',
          }),
        { initialProps: { value: 'initial' } }
      );

      expect(result.current[0]).toBe('initial');

      rerender({ value: 'updated' });

      expect(result.current[0]).toBe('updated');
    });

    it('should call onChange but not update state in controlled mode', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useControllableState({
          value: 'controlled',
          defaultValue: 'default',
          onChange,
        })
      );

      expect(result.current[0]).toBe('controlled');

      act(() => {
        result.current[1]('attempt-update');
      });

      expect(result.current[0]).toBe('controlled');
      expect(onChange).toHaveBeenCalledWith('attempt-update');
    });

    it('should support function updater in controlled mode', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useControllableState({
          value: 10,
          defaultValue: 0,
          onChange,
        })
      );

      act(() => {
        result.current[1]((prev) => prev + 5);
      });

      expect(result.current[0]).toBe(10); // Still controlled
      expect(onChange).toHaveBeenCalledWith(15);
    });
  });

  describe('mode switching', () => {
    it('should switch from uncontrolled to controlled', () => {
      const { result, rerender } = renderHook(
        ({ value }: { value: string | undefined }) =>
          useControllableState({
            value,
            defaultValue: 'default',
          }),
        { initialProps: { value: undefined as string | undefined } }
      );

      // Initially uncontrolled
      expect(result.current[0]).toBe('default');

      act(() => {
        result.current[1]('uncontrolled-update');
      });

      expect(result.current[0]).toBe('uncontrolled-update');

      // Switch to controlled
      rerender({ value: 'controlled' as string | undefined });

      expect(result.current[0]).toBe('controlled');
    });

    it('should switch from controlled to uncontrolled', () => {
      const { result, rerender } = renderHook(
        ({ value }: { value: string | undefined }) =>
          useControllableState({
            value,
            defaultValue: 'default',
          }),
        { initialProps: { value: 'controlled' as string | undefined } }
      );

      // Initially controlled
      expect(result.current[0]).toBe('controlled');

      // Switch to uncontrolled
      rerender({ value: undefined as string | undefined });

      // When switching from controlled to uncontrolled, it uses the internal state which is still at default
      expect(result.current[0]).toBe('default');

      act(() => {
        result.current[1]('uncontrolled-update');
      });

      expect(result.current[0]).toBe('uncontrolled-update');
    });
  });

  describe('edge cases', () => {
    it('should work with boolean values', () => {
      const { result } = renderHook(() =>
        useControllableState({
          value: undefined,
          defaultValue: false,
        })
      );

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });

    it('should work with object values', () => {
      const defaultValue = { count: 0 };
      const { result } = renderHook(() =>
        useControllableState({
          value: undefined,
          defaultValue,
        })
      );

      expect(result.current[0]).toEqual({ count: 0 });

      act(() => {
        result.current[1]({ count: 5 });
      });

      expect(result.current[0]).toEqual({ count: 5 });
    });

    it('should work with null as a value', () => {
      const { result } = renderHook(() =>
        useControllableState<string | null>({
          value: undefined,
          defaultValue: null,
        })
      );

      expect(result.current[0]).toBe(null);

      act(() => {
        result.current[1]('not-null');
      });

      expect(result.current[0]).toBe('not-null');
    });

    it('should work without onChange', () => {
      const { result } = renderHook(() =>
        useControllableState({
          value: undefined,
          defaultValue: 'test',
        })
      );

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
    });
  });
});
