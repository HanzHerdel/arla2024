// src/store/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

interface CounterState {
  user: User | null;
}

const initialState: CounterState = {
  user: null,
};

const userSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
