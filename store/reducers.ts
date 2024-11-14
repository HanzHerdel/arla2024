import { combineReducers } from "redux";
import userReducer from "./userSlice";
import elementosReducer from "./elementosSlice";

const rootReducer = combineReducers({
  user: userReducer,
  elementos: elementosReducer,
});

export default rootReducer;
