"use client";

import { useMemo } from "react";

interface UsePaginationArgs {
  total: number;
  pageSize: number;
  page: number;
  siblingCount?: number;
}

export type PageItem = number | "dots";

export function usePagination({ total, pageSize, page, siblingCount = 1 }: UsePaginationArgs) {
  return useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const totalNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalNumbers) {
      return {
        totalPages,
        items: Array.from({ length: totalPages }, (_, i) => (i + 1) as PageItem),
      };
    }

    const left = Math.max(page - siblingCount, 2);
    const right = Math.min(page + siblingCount, totalPages - 1);
    const showLeftDots = left > 2;
    const showRightDots = right < totalPages - 1;

    const items: PageItem[] = [1];
    if (showLeftDots) items.push("dots");
    for (let i = left; i <= right; i++) items.push(i);
    if (showRightDots) items.push("dots");
    items.push(totalPages);

    return { totalPages, items };
  }, [total, pageSize, page, siblingCount]);
}
