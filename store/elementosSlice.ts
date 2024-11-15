import {
  Categoria,
  Estacion,
  GenericValue,
  Linea,
  Marca,
  Modelo,
  Proveedor,
  Usuario,
} from "@/types";
import { generateYearsList } from "@/utils/dates";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Ubicacion } from "@/utils/constants";

export interface ElementosInitialState {
  usuarios: Usuario[];
  estaciones: Estacion[];
  marcas: Marca[];
  categorias: Categoria[];
  modelos: Modelo[];
  lineas: Linea[];
  proveedores: Proveedor[];
  estados: GenericValue[];
  lados: GenericValue[];
  ubicaciones: GenericValue[];
}

export const initialState: ElementosInitialState = {
  usuarios: [],
  estaciones: [],
  marcas: [],
  categorias: [],
  modelos: generateYearsList(),
  lineas: [],
  proveedores: [],
  estados: [
    { id: "nuevo", nombre: "Nuevo" },
    { id: "usado", nombre: "Usado" },
  ],
  lados: [
    { id: "DELANTERO", nombre: "DELANTERO" },
    { id: "LH", nombre: "LH" },
    { id: "RH", nombre: "RH" },
    { id: "TRASERO", nombre: "TRASERO" },
  ],
  ubicaciones: [
    { id: Ubicacion.ventas, nombre: Ubicacion.ventas },
    { id: Ubicacion.bodega, nombre: Ubicacion.bodega },
    { id: Ubicacion.caja, nombre: Ubicacion.caja },
    { id: Ubicacion.despacho, nombre: Ubicacion.despacho },
    { id: Ubicacion.indefinida, nombre: Ubicacion.indefinida },
  ],
};

export const Elementos = Object.fromEntries(
  Object.keys(initialState).map((key) => [key, key])
) as { [K in keyof ElementosInitialState]: K };

const elementosSlice = createSlice({
  name: "elementos",
  initialState,
  reducers: {
    setUsuarios: (state, action: PayloadAction<Usuario[]>) => {
      state.usuarios = action.payload;
    },
    setEstaciones: (state, action: PayloadAction<Estacion[]>) => {
      state.estaciones = action.payload;
    },
    setMarcas: (state, action: PayloadAction<Marca[]>) => {
      state.marcas = action.payload;
    },
    setCategorias: (state, action: PayloadAction<Categoria[]>) => {
      state.categorias = action.payload;
    },
    /*  setModelos: (state, action: PayloadAction<Modelo[]>) => {
      state.modelos = action.payload;
    }, */
    setLineas: (state, action: PayloadAction<Linea[]>) => {
      state.lineas = action.payload;
    },
    setProveedores: (state, action: PayloadAction<Proveedor[]>) => {
      state.proveedores = action.payload;
    },
  },
});

export const {
  setUsuarios,
  setEstaciones,
  setMarcas,
  setCategorias,
  setLineas,
  setProveedores,
} = elementosSlice.actions;

export const useElementos: () => RootState["elementos"] = () => {
  return useSelector((state: RootState) => state.elementos);
};

export function useElemento<T extends keyof RootState["elementos"]>(
  key: T
): RootState["elementos"][T] {
  return useSelector((state: RootState) => {
    return state.elementos[key];
  });
}

const elementosReducer = elementosSlice.reducer;
export default elementosReducer;
