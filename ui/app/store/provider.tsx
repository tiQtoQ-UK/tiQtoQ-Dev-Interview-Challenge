"use client";

import { Provider } from "react-redux";
import type { ReactNode } from "react";

import { store } from ".";

export function StoreProvider({ children }: Readonly<{ children: ReactNode }>) {
  return <Provider store={store}>{children}</Provider>;
}
