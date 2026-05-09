import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Gender = "male" | "female" | "other";

export interface StoredUser {
  id: string;
  fullname: string;
  email: string;
  password: string;
  gender: Gender;
  mobile: string;
  createdAt: number;
}

interface UsersState {
  list: StoredUser[];
}

const initialState: UsersState = { list: [] };

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<StoredUser>) {
      state.list.push(action.payload);
    },
  },
});

export const { addUser } = usersSlice.actions;
export default usersSlice.reducer;
