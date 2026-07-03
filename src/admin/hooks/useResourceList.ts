import { useCallback, useEffect, useState } from "react";
import { api, buildQuery } from "../api/client.ts";
import type { PaginatedResult } from "../types.ts";

interface UseResourceListOptions {
  basePath: string;
  defaultSortBy?: string;
  defaultSortOrder?: "asc" | "desc";
  extraParams?: Record<string, string | undefined>;
}

export function useResourceList<T extends { id: string }>({
  basePath,
  defaultSortBy = "createdAt",
  defaultSortOrder = "desc",
  extraParams = {},
}: UseResourceListOptions) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(defaultSortOrder);
  const [loading, setLoading] = useState(true);
  const [reloadTick, setReloadTick] = useState(0);

  const extraKey = JSON.stringify(extraParams);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQuery({
        page,
        pageSize,
        search: search || undefined,
        sortBy,
        sortOrder,
        ...extraParams,
      });
      const result = await api.get<PaginatedResult<T>>(`${basePath}${qs}`);
      setItems(result.items);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePath, page, pageSize, search, sortBy, sortOrder, extraKey, reloadTick]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [search, extraKey]);

  const handleSortChange = (key: string) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  const refresh = () => setReloadTick((t) => t + 1);

  return {
    items, page, setPage, pageSize, total, totalPages,
    search, setSearch, sortBy, sortOrder, onSortChange: handleSortChange,
    loading, refresh,
  };
}
