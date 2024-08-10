import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "@store/reducers";

export const store = configureStore({
  reducer: rootReducer,
});

// store data
export const setItem = (key: string, value: any) => {
  let dataStorage: any;
  if (typeof window !== "undefined") {
    dataStorage = localStorage.setItem(key, JSON.stringify(value));
  }
  return dataStorage;
};

// get data
export const getItem = (key: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
};

// delete data
export const removeItem = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

