import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  fullname: string;
  email: string;
}

interface AuthState {
  current: AuthUser | null;
}

const initialState: AuthState = { current: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<AuthUser>) {
      state.current = action.payload;
    },
    clearCurrentUser(state) {
      state.current = null;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = authSlice.actions;
export default authSlice.reducer;
