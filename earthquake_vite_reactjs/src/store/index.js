import { configureStore } from "@reduxjs/toolkit";
import earthquakeReducer from "./earthquake";

export const store = configureStore({
  reducer: { earthquake: earthquakeReducer },
});
