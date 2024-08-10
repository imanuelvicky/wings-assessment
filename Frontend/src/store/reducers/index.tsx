// index.js pada page reducers
import { combineReducers } from "@reduxjs/toolkit";
import dataCount from "./dataCount";

const rootReducer = combineReducers({
  dataCount,
});
export default rootReducer;
