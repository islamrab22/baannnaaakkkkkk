export interface PaginationQuery {
  page?: string;
  pageSize?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface NormalizedPagination {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
  sortBy?: string;
  sortOrder: "asc" | "desc";
  search?: string;
}

export function normalizePagination(query: PaginationQuery, allowedSortFields: string[], defaultSort: string): NormalizedPagination {
  const page = Math.max(1, parseInt(query.page ?? "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize ?? "10", 10) || 10));
  const sortOrder: "asc" | "desc" = query.sortOrder === "asc" ? "asc" : "desc";
  const sortBy = allowedSortFields.includes(query.sortBy ?? "") ? query.sortBy : defaultSort;

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
    sortBy,
    sortOrder,
    search: query.search?.trim() || undefined,
  };
}

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function buildPaginatedResult<T>(items: T[], total: number, page: number, pageSize: number): PaginatedResult<T> {
  return {
    items,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  };
}
