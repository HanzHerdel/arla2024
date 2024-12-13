import { configureStore, UnknownAction } from "@reduxjs/toolkit";
import rootReducers from "./reducers";

const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export interface ReduxAction<T> extends UnknownAction {
  type: string;
  payload: T[];
}

export type RootState = ReturnType<typeof store.getState>;
export default store;
