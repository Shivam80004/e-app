import type { Product, ProductsResponse } from "./types";

const BASE = "https://dummyjson.com";

interface FetchProductsArgs {
  q: string;
  page: number;
  limit: number;
  signal?: AbortSignal;
}

export async function fetchProducts({
  q,
  page,
  limit,
  signal,
}: FetchProductsArgs): Promise<ProductsResponse> {
  const skip = (page - 1) * limit;
  const url = q
    ? `${BASE}/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    : `${BASE}/products?limit=${limit}&skip=${skip}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
  return res.json();
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE}/products/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(
  id: number,
  changes: Partial<Product>
): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean }> {
  const res = await fetch(`${BASE}/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}
