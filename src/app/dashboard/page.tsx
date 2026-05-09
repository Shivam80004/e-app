"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { Pagination } from "@/components/dashboard/Pagination";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { ProductFormModal } from "@/components/dashboard/ProductFormModal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  productCreated,
  productDeleted,
  productUpdated,
} from "@/store/slices/productsSlice";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/lib/api";
import type { Product, ProductsResponse } from "@/lib/types";
import type { ProductFormValues } from "@/lib/validation";
import { useAuth } from "@/hooks/useAuth";

const PAGE_SIZE = 9;

export default function DashboardPage() {
  const { current } = useAuth();
  const dispatch = useAppDispatch();
  const localCreated = useAppSelector((s) => s.products.created);
  const localUpdates = useAppSelector((s) => s.products.updates);
  const deletedIds = useAppSelector((s) => s.products.deletedIds);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);

  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);

    fetchProducts({ q: debouncedQuery, page, limit: PAGE_SIZE, signal: ctrl.signal })
      .then((res) => setData(res))
      .catch((err: unknown) => {
        if ((err as Error).name === "AbortError") return;
        setError("We couldn't load products. Please try again.");
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [debouncedQuery, page]);

  // Merge API data with local Redux overrides so CRUD is reflected in the UI.
  const visibleProducts = useMemo<Product[]>(() => {
    const apiProducts = (data?.products ?? [])
      .filter((p) => !deletedIds.includes(p.id))
      .map((p) => ({ ...p, ...(localUpdates[p.id] ?? {}) }));

    if (page === 1 && !debouncedQuery) {
      return [...localCreated, ...apiProducts].slice(0, PAGE_SIZE);
    }
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      const matching = localCreated.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.category ?? "").toLowerCase().includes(q)
      );
      return [...matching, ...apiProducts].slice(0, PAGE_SIZE);
    }
    return apiProducts;
  }, [data, deletedIds, localUpdates, localCreated, page, debouncedQuery]);

  const total = (data?.total ?? 0) + (page === 1 ? localCreated.length : 0);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);
  const openEdit = useCallback((p: Product) => {
    setEditing(p);
    setFormOpen(true);
  }, []);

  const handleSubmitForm = useCallback(
    async (values: ProductFormValues, original?: Product | null) => {
      if (original) {
        // Build a partial diff: only pass fields that actually changed.
        const changes: Partial<Product> = {};
        if (values.title !== original.title) changes.title = values.title;
        if (Number(values.price) !== original.price) changes.price = Number(values.price);
        if (values.description !== original.description) changes.description = values.description;
        if (values.category !== (original.category ?? "")) changes.category = values.category;
        if (values.thumbnail !== (original.thumbnail ?? "")) changes.thumbnail = values.thumbnail;

        if (Object.keys(changes).length === 0) return;

        try {
          // For locally-created products, DummyJSON has no record — just update local state.
          if (original.id >= 1_000_000) {
            dispatch(productUpdated({ id: original.id, changes }));
            return;
          }
          await updateProduct(original.id, changes);
          dispatch(productUpdated({ id: original.id, changes }));
        } catch {
          setError("Failed to update product. Please try again.");
        }
      } else {
        try {
          const created = await createProduct({
            title: values.title,
            price: Number(values.price),
            description: values.description,
            category: values.category,
            thumbnail: values.thumbnail || undefined,
          });
          // DummyJSON returns an id but doesn't actually persist; offset to avoid clashes.
          const localId = 1_000_000 + Date.now();
          dispatch(
            productCreated({
              ...created,
              id: localId,
              title: values.title,
              price: Number(values.price),
              description: values.description,
              category: values.category,
              thumbnail: values.thumbnail || created.thumbnail || "",
            })
          );
        } catch {
          setError("Failed to create product. Please try again.");
        }
      }
    },
    [dispatch]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDelete) return;
    setDeleteLoading(true);
    try {
      if (confirmDelete.id < 1_000_000) {
        await deleteProduct(confirmDelete.id);
      }
      dispatch(productDeleted(confirmDelete.id));
      setConfirmDelete(null);
    } catch {
      setError("Failed to delete product. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  }, [confirmDelete, dispatch]);

  const firstName = current?.fullname?.split(" ")[0] ?? "there";

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <section className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="animate-fade-in-up">
          <p className="chip mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
            Catalog
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
            Welcome, {current?.fullname ?? firstName}.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-600">
            Search the live catalog, refine your selection, and curate products with confidence.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-80">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <Button variant="accent" onClick={openCreate} leftIcon={<span className="text-base leading-none">＋</span>}>
            New product
          </Button>
        </div>
      </section>

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="rounded-md px-2 py-1 text-xs font-medium hover:bg-rose-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton aspect-[4/3] w-full" />
              <div className="space-y-2 p-4">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-500">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="font-display text-lg font-semibold text-ink-950">No products found</h3>
          <p className="mt-1 max-w-sm text-sm text-ink-600">
            {query
              ? `We couldn't find anything matching "${query}". Try a different keyword.`
              : "Your catalog is empty. Create your first product to get started."}
          </p>
        </div>
      ) : (
        <div className="grid animate-fade-in-up grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onEdit={openEdit}
              onDelete={(prod) => setConfirmDelete(prod)}
            />
          ))}
        </div>
      )}

      {!loading && visibleProducts.length > 0 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <Pagination
            total={total}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={setPage}
          />
          <p className="text-xs text-ink-500">
            Page {page} · {total} products total
          </p>
        </div>
      )}

      <ProductFormModal
        open={formOpen}
        initial={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmitForm}
      />
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete this product?"
        description={
          confirmDelete
            ? `"${confirmDelete.title}" will be removed from your catalog. This can't be undone.`
            : ""
        }
        confirmLabel="Delete product"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmDelete(null)}
      />
    </main>
  );
}
