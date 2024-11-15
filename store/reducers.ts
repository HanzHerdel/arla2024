import { combineReducers } from "redux";
import userReducer from "./trasladosSlice";
import elementosReducer from "./elementosSlice";
import trasladosReducer from "./trasladosSlice";

const rootReducer = combineReducers({
  user: userReducer,
  elementos: elementosReducer,
  traslados: trasladosReducer,
});

export default rootReducer;
