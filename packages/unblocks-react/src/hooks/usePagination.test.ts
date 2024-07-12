import { act, renderHook } from '@testing-library/react';

import usePagination from '../../src/hooks/usePagination';

describe('usePagination', () => {
  describe('initialization', () => {
    it('with default settings', () => {
      const { result } = renderHook(() => usePagination(12));

      expect(result.current.page).toBe(1);
      expect(result.current.pageSize).toBe(10);
    });
    it('with initial page and items per page', () => {
      const { result } = renderHook(() => usePagination(12, 2, 5));

      expect(result.current.page).toBe(2);
      expect(result.current.pageSize).toBe(5);
    });
  });
  it('setPage', () => {
    const { result } = renderHook(() => usePagination(12));

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);
  });
  it('setPageSize', () => {
    const { result } = renderHook(() => usePagination(12));

    act(() => {
      result.current.setPageSize(3);
    });

    expect(result.current.pageSize).toBe(3);
  });
  it('startIndex', () => {
    const { result } = renderHook(() => usePagination(12, 2, 5));
    expect(result.current.startIndex).toBe(5);
  });
  it('pageCount', () => {
    const { result } = renderHook(() => usePagination(12, 2, 5));
    expect(result.current.pageCount).toBe(3);
  });
  describe('hasNext', () => {
    it('returns true when there is next page', () => {
      const { result } = renderHook(() => usePagination(12, 2, 5));
      expect(result.current.hasNext).toBe(true);
    });
    it('returns false when there is no next page', () => {
      const { result } = renderHook(() => usePagination(1, 1, 10));
      expect(result.current.hasNext).toBe(false);
    });
  });
  describe('hasPrevious', () => {
    it('returns true when there is previous page', () => {
      const { result } = renderHook(() => usePagination(12, 2, 5));
      expect(result.current.hasPrevious).toBe(true);
    });
    it('returns false when there is no previous page', () => {
      const { result } = renderHook(() => usePagination(1, 1, 10));
      expect(result.current.hasPrevious).toBe(false);
    });
  });
  describe('goTo', () => {
    it('first', () => {
      const { result } = renderHook(() => usePagination(12, 2, 5));
      act(() => {
        result.current.goTo.first();
      });
      expect(result.current.page).toBe(1);
    });
    it('previous', () => {
      const { result } = renderHook(() => usePagination(12, 2, 5));
      act(() => {
        result.current.goTo.previous();
      });
      expect(result.current.page).toBe(1);
    });
    it('next', () => {
      const { result } = renderHook(() => usePagination(12, 2, 5));
      act(() => {
        result.current.goTo.next();
      });
      expect(result.current.page).toBe(3);
    });
    it('last', () => {
      const { result } = renderHook(() => usePagination(12, 2, 5));
      act(() => {
        result.current.goTo.last();
      });
      expect(result.current.page).toBe(3);
    });
  });
  it('getItemsOnCurrentPage', () => {
    const { result } = renderHook(() => usePagination(6, 2, 2));
    expect(result.current.getItemsOnCurrentPage([1, 2, 3, 4, 5, 6])).toEqual([3, 4]);
  });
});