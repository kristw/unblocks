import { useCallback, useState } from 'react';

export default function usePagination(itemsCount: number, initialPage = 1, initialPageSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const pageCount = Math.ceil(itemsCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const itemsOnCurrentPage = page < pageCount ? pageSize : itemsCount - (pageCount - 1) * pageSize;
  const hasNext = page < pageCount;
  const hasPrevious = page > 1;

  const getItemsOnCurrentPage = useCallback(
    <T>(items: T[]) => items.slice(startIndex, startIndex + pageSize),
    [pageSize, startIndex]
  );

  const first = useCallback(() => setPage(1), [setPage]);
  const last = useCallback(() => setPage(pageCount), [setPage, pageCount]);
  const next = useCallback(() => setPage(page + 1), [setPage, page]);
  const previous = useCallback(() => setPage(page - 1), [setPage, page]);

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    startIndex,
    pageCount,
    itemsOnCurrentPage,
    hasNext,
    hasPrevious,
    goTo: { first, last, next, previous },
    getItemsOnCurrentPage,
  };
}
