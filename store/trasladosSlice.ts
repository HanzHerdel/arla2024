// src/store/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Traslados, Usuario } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "./store";

export interface TrasladosState {
  traslados: Traslados[];
}

export const initialState: TrasladosState = {
  traslados: [],
};

const trasladosSlice = createSlice({
  name: "traslados",
  initialState,
  reducers: {
    setTraslados: (state, action: PayloadAction<Traslados[]>) => {
      console.log("action: ", action);
      state.traslados = action.payload;
    },
  },
});

export const useTraslados: () => RootState["traslados"]["traslados"] = () => {
  return useSelector((state: RootState) => state.traslados.traslados);
};
export const { setTraslados } = trasladosSlice.actions;

const trasladosReducer = trasladosSlice.reducer;
export default trasladosReducer;
