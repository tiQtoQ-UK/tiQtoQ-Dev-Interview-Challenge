import { configureStore } from "@reduxjs/toolkit";

import { analyseChangeReducer } from "./analyseChangeSlice";

export const store = configureStore({
  reducer: {
    analyseChange: analyseChangeReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
