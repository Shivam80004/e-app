"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const discounted =
    product.discountPercentage && product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  return (
    <article className="group card overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-50">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">No image</div>
        )}
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-700 backdrop-blur">
            {product.category}
          </span>
        )}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-semibold leading-tight text-ink-950 line-clamp-1">
            {product.title}
          </h3>
          {product.rating != null && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-ink-50 px-1.5 py-0.5 text-xs font-semibold text-ink-700">
              <svg viewBox="0 0 24 24" className="h-3 w-3 fill-amber-400 stroke-amber-400">
                <path d="m12 2 3 7 7 .8-5.3 4.7L18 22l-6-3.6L6 22l1.3-7.5L2 9.8 9 9z" />
              </svg>
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-xs text-ink-600">{product.description}</p>

        <div className="mt-1 flex items-baseline gap-2">
          {discounted != null ? (
            <>
              <span className="font-display text-lg font-semibold text-ink-950">
                ${discounted.toFixed(2)}
              </span>
              <span className="text-xs text-ink-400 line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-display text-lg font-semibold text-ink-950">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="mt-3 flex gap-2 border-t border-ink-100 pt-3">
          <button
            onClick={() => onEdit(product)}
            className="btn-outline flex-1 text-xs"
            aria-label={`Edit ${product.title}`}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="btn-ghost flex-1 text-xs text-rose-600 hover:bg-rose-50"
            aria-label={`Delete ${product.title}`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
