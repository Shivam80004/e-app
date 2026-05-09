import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/lib/types";

interface ProductsState {
  // Local overrides applied on top of API responses, so the UI reflects CRUD
  // operations even though DummyJSON does not actually persist them.
  created: Product[];
  updates: Record<number, Partial<Product>>;
  deletedIds: number[];
}

const initialState: ProductsState = {
  created: [],
  updates: {},
  deletedIds: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productCreated(state, action: PayloadAction<Product>) {
      state.created.unshift(action.payload);
    },
    productUpdated(
      state,
      action: PayloadAction<{ id: number; changes: Partial<Product> }>
    ) {
      const { id, changes } = action.payload;
      const localIndex = state.created.findIndex((p) => p.id === id);
      if (localIndex >= 0) {
        state.created[localIndex] = { ...state.created[localIndex], ...changes };
      } else {
        state.updates[id] = { ...(state.updates[id] ?? {}), ...changes };
      }
    },
    productDeleted(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.created = state.created.filter((p) => p.id !== id);
      delete state.updates[id];
      if (!state.deletedIds.includes(id)) state.deletedIds.push(id);
    },
  },
});

export const { productCreated, productUpdated, productDeleted } = productsSlice.actions;
export default productsSlice.reducer;
