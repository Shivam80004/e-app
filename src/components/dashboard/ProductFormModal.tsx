"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useValidation } from "@/hooks/useValidation";
import {
  validateProductForm,
  type ProductFormValues,
} from "@/lib/validation";
import type { Product } from "@/lib/types";

interface ProductFormModalProps {
  open: boolean;
  initial?: Product | null;
  onClose: () => void;
  onSubmit: (values: ProductFormValues, original?: Product | null) => Promise<void> | void;
}

const empty: ProductFormValues = {
  title: "",
  price: "",
  category: "",
  description: "",
  thumbnail: "",
};

export function ProductFormModal({ open, initial, onClose, onSubmit }: ProductFormModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const { values, errors, setValue, handleBlur, validateAll, reset } = useValidation<ProductFormValues>(
    empty,
    validateProductForm
  );

  useEffect(() => {
    if (open) {
      reset(
        initial
          ? {
              title: initial.title,
              price: String(initial.price),
              category: initial.category ?? "",
              description: initial.description,
              thumbnail: initial.thumbnail ?? "",
            }
          : empty
      );
    }
  }, [open, initial, reset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    setSubmitting(true);
    try {
      await onSubmit(values, initial);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit product" : "Create product"}
      description={
        initial
          ? "Update the fields you'd like to change. Unchanged fields stay as-is."
          : "Add a new product to your catalog."
      }
      size="md"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={values.title}
          onChange={(e) => setValue("title", e.target.value)}
          onBlur={() => handleBlur("title")}
          error={errors.title}
          placeholder="Premium Wireless Headphones"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Price (USD)"
            name="price"
            inputMode="decimal"
            value={values.price}
            onChange={(e) => setValue("price", e.target.value)}
            onBlur={() => handleBlur("price")}
            error={errors.price}
            placeholder="49.99"
          />
          <Input
            label="Category"
            name="category"
            value={values.category}
            onChange={(e) => setValue("category", e.target.value)}
            placeholder="audio"
          />
        </div>
        <div>
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={values.description}
            onChange={(e) => setValue("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            rows={3}
            className="input-base resize-none"
            placeholder="Short product description…"
          />
          {errors.description && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.description}</p>
          )}
        </div>
        <Input
          label="Thumbnail URL"
          name="thumbnail"
          value={values.thumbnail}
          onChange={(e) => setValue("thumbnail", e.target.value)}
          placeholder="https://…"
          hint="Optional. Paste a public image URL."
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="accent" loading={submitting}>
            {initial ? "Save changes" : "Create product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
